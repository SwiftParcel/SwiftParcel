import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { getAffectedRoutes, calculateNewRoute, updateRouteDetails } from './routeing.jsx'; // Import functions from routing

// Higher-order component to inject route params and location
function Myparam(Il) {
  return (props) => <Il {...props} params={useParams()} loc={useLocation()} navigate={useNavigate()} />;
}

class HubDelete extends React.Component {
  constructor() {
    super();
    this.state = {
      hub: {},
      hubs: [], // State to hold the list of active hubs
      invalidFields: {},
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.loadData();
    this.loadHubs(); // Fetch hubs when component mounts
  }

  componentDidUpdate(prevProps) {
    const {
      params: { id: prevId },
    } = prevProps;
    const {
      params: { id },
    } = this.props;
    if (id !== prevId) {
      this.loadData();
      this.loadHubs(); // Fetch hubs if the ID changes
    }
  }

  async loadData() {
    const { hub } = this.state;
    const currentId = parseInt(this.props.params.id);
    const { id, ...changes } = hub; // Removing id from the object

    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation hubDelete($hub: HubDeleteInputs!) {
            hubDelete(hub: $hub) {
              id
              isDeleted
            }
          }`,
          variables: { hub: { id: currentId, ...changes } },
        }),
      });
      const result = await response.json();
      
      if (result.data && result.data.hubDelete) {
        this.setState({ hub: result.data.hubDelete });
         alert('Hub deleted successfully');
         // Fetch affected routes
      const affectedRoutes = await getAffectedRoutes(currentId);
      console.log("Affected routes:..................", affectedRoutes);

      // Check if there are any affected routes
      if (affectedRoutes.length === 0) {
        console.log("No affected routes found.");
        return;
      }

      // Process each affected route
      for (const route of affectedRoutes) {
        console.log(" routes:..................", route);
        // Extract required details
        const { currentLocation, destination, trackingID } = route;
        console.log(" currentLocation:..................", currentLocation);
        console.log(" destination:..................", destination);
        console.log(" this.state.hubs:..................", this.state.hubs);
        // Calculate the new route
        const newRoute = await calculateNewRoute(currentLocation, destination, this.state.hubs);

        // Prepare route data
        const newRouteDetails = {
          trackingID,
          route: newRoute.route,
          currentLocation: route.currentLocation,
          origin: route.origin,
          destination: route.destination,
          waypoints: newRoute.waypoints,
        };
        console.log('New Route Details:', newRouteDetails);

        // Update the route details in the database
        await updateRouteDetails(trackingID, newRouteDetails);
        console.log(`Updated route ${trackingID} with new details.`);
      }
      console.log('..............hublist....');
        this.props.navigate('/hublist');
      } 
      else if(result.data === null){
        alert(' CANNOT DELETE HUB AS STATUS IS ACTIVE');
        this.props.navigate('/hublist');
      }
      else {
        throw new Error('No data returned from the server');
      }

     
    } catch (error) {
      console.error('Error updating routes:', error);
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

  onChange(event) {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      hub: { ...prevState.hub, [name]: value },
    }));
  }

  render() {
    const { hub: { id } } = this.state;
    const currentId = this.props.params.id;

    if (currentId == null) {
      return <h3>{`Hub with ID ${currentId} not found.`}</h3>;
    }

    return <div>Deleting Hub {currentId}...</div>;
  }
}

export default Myparam(HubDelete);
