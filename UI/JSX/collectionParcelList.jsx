import React from "react";
import axios from 'axios';
import { isPointInPolygon } from 'geolib';
import CollectionParcelCreation from './CollectionParcelCreation.jsx';
import CollectionParcelTable from './CollectionParcelTable.jsx';

export default class CollectionParcelList extends React.Component {
  constructor() {
    super();
    this.state = { collectionParceldetails: [], hubs: [], error: null };
  }

  componentDidMount() {
    this.loadData();
    this.loadHubs();
  }

  async loadData() {
    const query = `
      query {
        collectionParcelList {
          id
          ParcelHeight
          ParcelLength
          ParcelWidth
          ParcelWeight
          ParcelStatus
          ParcelOrigin
          ParcelDestination
          ParcelSenderName
          ParcelTrackingId
        }
      }
    `;
    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      this.setState({ collectionParceldetails: result.data.collectionParcelList });
    } catch (error) {
      console.error('Error loading data:', error);
      this.setState({ error: 'Failed to load parcel data' });
    }
  }

  async loadHubs() {
    const query = `
      query {
        hubList {
          id
          Name
          StreetNo
          City
          State
          Country
          isActive
        }
      }
    `;
    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      this.setState({ hubs: data.data.hubList });
    } catch (error) {
      console.error('Error fetching hubs:', error);
      this.setState({ error: 'Failed to fetch hubs' });
    }
  }

  async geocodeAddress(address) {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address,
          key: 'AIzaSyCiVJKBDrHZDFopDE5RwMhIv0xmCssfpmc',
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

  async findHubsBetween(origin, destination) {
    const { hubs } = this.state;

    try {
      // Geocode origin and destination
      const originCoords = await this.geocodeAddress(origin);
      const destinationCoords = await this.geocodeAddress(destination);

      // Create a bounding polygon around the origin and destination
      const boundingPolygon = [
        { latitude: originCoords.latitude, longitude: originCoords.longitude },
        { latitude: originCoords.latitude, longitude: destinationCoords.longitude },
        { latitude: destinationCoords.latitude, longitude: destinationCoords.longitude },
        { latitude: destinationCoords.latitude, longitude: originCoords.longitude },
      ];

      // Filter and sort hubs based on their distance from the origin
      const hubsBetween = await Promise.all(hubs.map(async hub => {
        const hubAddress = `${hub.StreetNo}, ${hub.City}, ${hub.State}, ${hub.Country}`;
        const hubCoords = await this.geocodeAddress(hubAddress);

        return {
          hub,
          coords: hubCoords,
          isWithinPolygon: isPointInPolygon(hubCoords, boundingPolygon)
        };
      }));

      // Filter to keep only hubs within the polygon and sort by distance from the origin
      const sortedHubs = hubsBetween
        .filter(hub => hub.isWithinPolygon)
        .sort((a, b) => {
          const distA = this.calculateDistance(originCoords, a.coords);
          const distB = this.calculateDistance(originCoords, b.coords);
          return distA - distB;
        })
        .map(hub => hub.hub);

      return sortedHubs;
    } catch (error) {
      console.error('Error finding hubs between:', error);
      throw error;
    }
  }

  calculateDistance(coord1, coord2) {
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

  async createCollectionParcel(ParcelData) {
    try {
      // Calculate the best route
      const { route, waypoints } = await this.calculateBestRoute(ParcelData.ParcelOrigin, ParcelData.ParcelDestination);
  
      // Prepare route data
      const routeData = {
        trackingID: ParcelData.ParcelTrackingId,
        route,
        currentLocation: ParcelData.ParcelCurrentLocation,
        origin: ParcelData.ParcelOrigin,
        destination: ParcelData.ParcelDestination,
        waypoints,
      };
      console.log('ParcelData:', ParcelData);
      console.log('RouteData:', routeData);
  
      // Add parcel using GraphQL mutation
      const response = await axios.post('http://localhost:8000/graphql', {
        query: `
          mutation AddParcel($parcel: ParcelInput!, $route: RouteInput!) {
            addParcel(parcel: $parcel, route: $route) {
              id
              ParcelTrackingId
              ParcelStatus
              ParcelCurrentLocation
              ParcelOrigin
              ParcelCurrentTime
            }
          }
        `,
        variables: {
          parcel: ParcelData,
          route: routeData,
        },
      });
      console.log('Parcel added:', response.data.data.addParcel);
      this.createParcelHistory(response.data.data.addParcel);
      this.loadData();
    } catch (error) {
      console.error('Error adding parcel:', error);
      this.setState({ error: 'Error adding parcel. Please try again.' });
    }
  }
  async createParcelHistory(ParcelData) {
    console.log('ParcelData............', ParcelData);
    var status="Readt To dispatch";
    var curenttime =new Date();
     // Prepare parcel data
     const parcelHistoryData = {
       ParceltrackingID: ParcelData.ParcelTrackingId,
       ParcelcurrentLocation: ParcelData.ParcelCurrentLocation,
       Parcelcurrenttime: ParcelData.ParcelCurrentTime,
       Parcelstatus: ParcelData.ParcelStatus,
     };
     console.log('parcelHistoryData:', parcelHistoryData);
    
     const query = `
      mutation {
        addParcelHistory(parcelHistory: {
          ParceltrackingID: "${parcelHistoryData.ParceltrackingID}"
          ParcelcurrentLocation: "${parcelHistoryData.ParcelcurrentLocation}"
          Parcelcurrenttime: "${parcelHistoryData.Parcelcurrenttime}"
          Parcelstatus: "${parcelHistoryData.Parcelstatus}"
                   }) {
          id
          ParceltrackingID
          ParcelcurrentLocation
          Parcelcurrenttime
          Parcelstatus
         }
      }
    `;

   const response = await fetch('http://localhost:8000/graphql', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ query }),
   });
   const result = await response.json();
   if (result.errors) {
     
   } else {
     
   }
 }
  calculateBestRoute = async (origin, destination) => {
    try {
      const hubsBetween = await this.findHubsBetween(origin, destination);
      console.log("Hubs between:", hubsBetween);
  
      const waypoints = hubsBetween.map(hub => ({
        location: `${hub.StreetNo}, ${hub.City}, ${hub.State}, ${hub.Country}`,
        stopover: true,
      }));
  
      const response = await axios.get('http://localhost:8000/api/directions', {
        params: {
          origin,
          destination,
          waypoints: waypoints.length ? waypoints.map(waypoint => waypoint.location).join('|') : '',
          key: 'AIzaSyCiVJKBDrHZDFopDE5RwMhIv0xmCssfpmc',
        },
      });
  
      if (response.data.status !== 'OK') {
        throw new Error('Failed to get directions');
      }
  
      return {
        route: response.data.routes[0].summary,
        waypoints: waypoints.map(wp => wp.location), // Return waypoints
      };
    } catch (error) {
      console.error('Error calculating best route:', error);
      throw error;
    }
  };

  render() {
    return (
      <div>
        <CollectionParcelCreation createCollectionParcel={this.createCollectionParcel.bind(this)} />
        <h1 style={{ textAlign: 'center', marginTop: '30px' }}>All Parcels</h1>
        <CollectionParcelTable data={this.state.collectionParceldetails} />
      </div>
    );
  }
}