import axios from 'axios';
import { isPointInPolygon } from 'geolib';
//import isPointInPolygon from 'point-in-polygon'; // Ensure this is installed or available

// Function to update route details
export async function updateRouteDetails(trackingID, newRoute) {
  console.log("trackingID.........",trackingID);
  console.log("newRoute.........",newRoute);
  const { id, ...changes } = newRoute; // Removing id from the object
  try {
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `mutation updateRoute($newRoute: RouteInput!) {
          updateRoute(newRoute: $newRoute) {
                trackingID 
          }
        }`,
        variables: { newRoute: { trackingID: trackingID, ...changes } },
      }),
    });
   const result = await response.json();
   
    console.log('rrr', result);
    
  } catch (error) {
    console.error('Error updating route details:', error);
    // Handle error
  }

  // try {
  //   const response = await axios.post('http://localhost:8000/graphql', {
  //     query: `
  //       mutation UpdateRoute($trackingID: String!, $route: RouteInput!) {
  //         updateRoute(trackingID: $trackingID, route: $route) {
  //           trackingID
  //           route
  //         }
  //       }
  //     `,
  //     variables: {
  //       trackingID,
  //       route: newRoute,
  //     },
  //   });
  //   //console.log('Route updated:', response.data.updateRoute);
  // } catch (error) {
  //   console.error('Error updating route details:', error);
  // }
}

// Function to geocode an address
export async function geocodeAddress(address) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: 'AIzaSyCiVJKBDrHZDFopDE5RwMhIv0xmCssfpmc', // Ensure you secure your API key
      },
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Failed to geocode address: ${address}`);
    }

    const location = response.data.results[0].geometry.location;
    return { latitude: location.lat, longitude: location.lng };
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
}

// Function to find hubs between two locations
export async function findHubsBetween(currentLocation, destination, hubs) {
  try {
    // Geocode origin and destination
    const currentLocationCoords = await geocodeAddress(currentLocation);
    const destinationCoords = await geocodeAddress(destination);

    // Create a bounding polygon around the origin and destination
    const boundingPolygon = [
      { latitude: currentLocationCoords.latitude, longitude: currentLocationCoords.longitude },
      { latitude: currentLocationCoords.latitude, longitude: destinationCoords.longitude },
      { latitude: destinationCoords.latitude, longitude: destinationCoords.longitude },
      { latitude: destinationCoords.latitude, longitude: currentLocationCoords.longitude },
    ];

    // Use Promise.all to handle multiple async geocode requests
    const hubsBetween = await Promise.all(hubs.map(async hub => {
      const hubAddress = `${hub.StreetNo}, ${hub.City}, ${hub.State}, ${hub.Country}`;
      const hubCoords = await geocodeAddress(hubAddress);

      return {
        hub,
        coords: hubCoords,
        isWithinPolygon: isPointInPolygon(hubCoords, boundingPolygon)
      };
    }));

    // Filter to keep only hubs within the polygon
    const filteredHubs = hubsBetween.filter(hub => hub.isWithinPolygon);

    // If no hubs are within the boundary, find the nearest active hub
    if (filteredHubs.length === 0) {
      // Sort all active hubs by distance to the origin
      const sortedHubs = (await Promise.all(hubs.filter(hub => hub.isActive === 1).map(async hub => {
        const hubAddress = `${hub.StreetNo}, ${hub.City}, ${hub.State}, ${hub.Country}`;
        const hubCoords = await geocodeAddress(hubAddress);
        return {
          hub,
          coords: hubCoords,
          distance: calculateDistance(currentLocationCoords, hubCoords)
        };
      }))).sort((a, b) => a.distance - b.distance);

      // Select the nearest active hub
      if (sortedHubs.length > 0) {
        filteredHubs.push(sortedHubs[0]);
      } else {
        throw new Error("No active hubs available.");
      }
    }

    // Sort the filtered hubs by distance from the origin
    const sortedHubs = filteredHubs.sort((a, b) => {
      const distA = calculateDistance(currentLocationCoords, a.coords);
      const distB = calculateDistance(currentLocationCoords, b.coords);
      return distA - distB;
    }).map(hub => hub.hub);

    return sortedHubs;
  } catch (error) {
    console.error('Error finding hubs between:', error);
    throw error;
  }
}

// Function to calculate distance between two coordinates
function calculateDistance(coord1, coord2) {
  const R = 6371e3; // Earth radius in meters
  const lat1 = coord1.latitude * Math.PI / 180;
  const lat2 = coord2.latitude * Math.PI / 180;
  const deltaLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const deltaLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export async function getHubDetails(hubId) {
  const query = `
    query getDetailsForUpdate($id: Int!) {
      hubdetailsList(id: $id) {
        id
        Name
        StreetNo
        City
        State
        Country
        PostalCode
        isActive
      }
    }
  `;

  try {
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { id: hubId },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(`GraphQL error: ${result.errors.map(err => err.message).join(', ')}`);
    }

    if (!result.data || !result.data.hubdetailsList) {
      throw new Error('Unexpected response format');
    }

    return result.data.hubdetailsList[0];
  } catch (error) {
    console.error('Error fetching hub details:', error);
    throw error;
  }
}

// Function to calculate a new route based on waypoints
export async function calculateNewRoute(currentLocation, destination, hubs) {
  console.log(" calculateNewRoute......:");
  console.log(" currentLocation......:", currentLocation);
  console.log(" destination......:", destination);
  console.log(" hubs......:", hubs);
  const activeHubs = hubs.filter(hub => hub.isActive === 1);
  console.log(" activeHubs:", activeHubs);
  

    // Find hubs between locations
    const hubsBetween = await findHubsBetween(currentLocation, destination, activeHubs);
  console.log("Hubs between:", hubsBetween);
  
  try {
    const waypoints = hubsBetween.map(hub => ({
      location: `${hub.StreetNo}, ${hub.City}, ${hub.State}, ${hub.Country}`,
      stopover: true,
    }));
    console.log("new Waypoint is :", waypoints);
  
    const origin = currentLocation;
    const response = await axios.get('http://localhost:8000/api/directions', {
      params: {
        origin,
        destination,
        waypoints: waypoints.length ? waypoints.map(wp => wp.location).join('|') : '',
        key: 'AIzaSyCiVJKBDrHZDFopDE5RwMhIv0xmCssfpmc', // Ensure you secure your API key
      },
    });

    if (response.data.status !== 'OK') {
      throw new Error('Failed to get directions');
    }

    return {
      route: response.data.routes[0].summary,
      waypoints: waypoints.map(wp => wp.location),
    };
  } catch (error) {
    console.error('Error calculating new route:', error);
    throw error;
  }
}

// Function to get affected routes based on a hub ID
export async function getAffectedRoutes(hubId) {
  try {
    // Fetch the hub details to get the address
    const hubDetails = await getHubDetails(hubId);
    const hubAddress = `${hubDetails.StreetNo}, ${hubDetails.City}, ${hubDetails.State}, ${hubDetails.Country}`.trim().toLowerCase();
    console.log("Normalized Hub Address:", hubAddress);

    // Query to get all routes
    const routesQuery = `
      query {
        routes {
          trackingID
          route
          currentLocation
          origin
          destination
          waypoints
        }
      }
    `;

    // Fetch routes from the API
    const routesResponse = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: routesQuery }),
    });

    const routesResult = await routesResponse.json();

    // Log the result to check its structure
    console.log("Routes Result:", routesResult);

    if (routesResult.errors) {
      throw new Error(`GraphQL error: ${routesResult.errors.map(err => err.message).join(', ')}`);
    }

    if (!routesResult.data || !routesResult.data.routes) {
      throw new Error('Unexpected response format');
    }

    const routes = routesResult.data.routes;

    // Log the routes data for debugging
    console.log("Routes Data:", routes);

    // Filter affected routes
    const affectedRoutes = routes.filter(route => {
      if (!route.waypoints || !Array.isArray(route.waypoints)) {
        console.log("Invalid waypoints format:", route.waypoints);
        return false;
      }

      // Log each waypoint
      console.log("Waypoints:", route.waypoints);

      // Check for partial match
      const hasMatch = route.waypoints.some(waypoint => {
        const normalizedWaypoint = waypoint.trim().toLowerCase();
        console.log("Comparing waypoint:", normalizedWaypoint);
        const isMatch = normalizedWaypoint.includes(hubAddress);
        console.log(`Partial match for ${hubAddress} with ${normalizedWaypoint}: ${isMatch}`);
        return isMatch;
      });

      // Return the full route details if there is a match
      if (hasMatch) {
        console.log("Affected Route:", route);
        return true;
      }

      return false;
    });

    // Log affected routes
    console.log("Affected Routes:", affectedRoutes);

    return affectedRoutes;
  } catch (error) {
    console.error('Error fetching affected routes:', error);
    throw error;
  }
}