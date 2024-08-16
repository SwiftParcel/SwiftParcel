import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api';
import './Tracking.css';

// Function to fetch route details
const fetchRouteDetails = async (trackingID) => {
  try {
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query routeDetails($trackingID: String!) {
            routeDetails(trackingID: $trackingID) {
              trackingID
              route
              currentLocation
              origin
              destination
              waypoints
            }
          }
        `,
        variables: { trackingID },
      }),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const result = await response.json();
    console.log("Route Result:", result);
    return result;
  } catch (error) {
    console.error('Error fetching route details:', error);
    throw error;
  }
};

// Function to fetch parcel history
const fetchParcelHistory = async (trackingID) => {
  try {
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query parcelHistory($ParceltrackingID: String!) {
            parcelHistory(ParceltrackingID: $ParceltrackingID) {
              ParceltrackingID
              ParcelcurrentLocation
              Parcelcurrenttime
              Parcelstatus
            }
          }
        `,
        variables: { ParceltrackingID: trackingID },
      }),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const result = await response.json();
    console.log("History Result:", result);
    return result;
  } catch (error) {
    console.error('Error fetching parcel history:', error);
    throw error;
  }
};

// Component for tracking details
const Tracking = () => {
  const { trackingID } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [parcelHistory, setParcelHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [directionsOptions, setDirectionsOptions] = useState(null);
  const [markers, setMarkers] = useState([]);

  const fetchTrackingDetails = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch route details
      const routeResult = await fetchRouteDetails(trackingID);

      if (routeResult.errors) {
        setError(routeResult.errors[0].message);
        setRoute(null);
      } else if (routeResult.data && routeResult.data.routeDetails) {
        await geocodeAddresses(routeResult.data.routeDetails);
      } else {
        setError('No route details found');
        setRoute(null);
        return; // Exit early if no route details found
      }

      // Fetch parcel history
      const historyResult = await fetchParcelHistory(trackingID);

      if (historyResult.errors) {
        setError(historyResult.errors[0].message);
        setParcelHistory([]);
      } else if (historyResult.data && historyResult.data.parcelHistory) {
        // Sort parcel history by Parcelcurrenttime in descending order
        const sortedHistory = historyResult.data.parcelHistory.sort(
          (a, b) => new Date(b.Parcelcurrenttime) - new Date(a.Parcelcurrenttime)
        );
        setParcelHistory(sortedHistory);
      } else {
        setError('No parcel history found');
        setParcelHistory([]);
      }
    } catch (error) {
      console.error('Error fetching tracking details:', error);
      setError('An error occurred while fetching tracking details');
    } finally {
      setLoading(false);
    }
  }, [trackingID]);

  const geocodeAddresses = async (routeDetails) => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps API not loaded');
      setError('Google Maps API not loaded');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    const geocodeAddress = (address) => {
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results[0]) {
            resolve(results[0].geometry.location);
          } else {
            reject(`Geocode was not successful for the following reason: ${status}`);
          }
        });
      });
    };

    try {
      const originCoords = await geocodeAddress(routeDetails.origin);
      const destinationCoords = await geocodeAddress(routeDetails.destination);
      const currentLocationCoords = await geocodeAddress(routeDetails.currentLocation);
      const waypointsCoords = await Promise.all(routeDetails.waypoints.map(geocodeAddress));

      setRoute({
        ...routeDetails,
        originCoords,
        destinationCoords,
        currentLocationCoords,
        waypointsCoords,
      });

      setDirectionsOptions({
        origin: originCoords,
        destination: destinationCoords,
        waypoints: waypointsCoords.map(coord => ({ location: coord, stopover: true })),
        travelMode: 'DRIVING',
      });

      setMarkers([
        { position: originCoords, label: 'Origin', icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
        { position: currentLocationCoords, label: 'Current Location', icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' },
        { position: destinationCoords, label: 'Destination', icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' },
        ...waypointsCoords.map((coord, index) => ({
          position: coord,
          label: `Waypoint ${index + 1}`,
          icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
        }))
      ]);
    } catch (error) {
      console.error('Error geocoding addresses:', error);
      setError('Failed to geocode addresses');
    }
  };

  useEffect(() => {
    fetchTrackingDetails();
  }, [fetchTrackingDetails]);

  useEffect(() => {
    if (error) {
      // Redirect to the previous page or home
      setTimeout(() => {
        navigate(-1); // Go back to the previous page
      }, 3000); // Delay for 3 seconds to let the user see the error message
    }
  }, [error, navigate]);

  const directionsCallback = (response) => {
    if (response?.status === 'OK') {
      setDirectionsResponse(response);
    } else {
      setError('Failed to get directions');
    }
  };

  return (
    <div className="tracking-container">
      <header className="tracking-header">
        <h1>Track Your Parcel</h1>
      </header>
      <div className="tracking-content">
        {loading ? (
          <div className="tracking-loading">Loading...</div>
        ) : error ? (
          <div className="tracking-error">{error}</div>
        ) : route ? (
          <>
            <GoogleMap
              mapContainerClassName="tracking-map"
              center={route.currentLocationCoords || { lat: 0, lng: 0 }}
              zoom={12}
            >
              {directionsOptions && !directionsResponse && (
                <DirectionsService
                  options={directionsOptions}
                  callback={directionsCallback}
                />
              )}
              {directionsResponse && (
                <DirectionsRenderer
                  options={{ directions: directionsResponse }}
                />
              )}
              {markers.map((marker, index) => (
                <Marker
                  key={index}
                  position={marker.position}
                  label={marker.label}
                  icon={marker.icon}
                />
              ))}
            </GoogleMap>
            <div className="tracking-parcel-history">
              <h2>Parcel History</h2>
              {parcelHistory.length > 0 ? (
                parcelHistory.map((history) => (
                  <div key={history.ParceltrackingID} className="tracking-history-item">
                    <p><strong>Location:</strong> {history.ParcelcurrentLocation}</p>
                    <p><strong>Time:</strong> {new Date(history.Parcelcurrenttime).toLocaleString()}</p>
                    <p><strong>Status:</strong> {history.Parcelstatus}</p>
                    <hr />
                  </div>
                ))
              ) : (
                <p>No parcel history available for this tracking ID.</p>
              )}
            </div>
          </>
        ) : (
          <div className="tracking-no-details">No route details available</div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
