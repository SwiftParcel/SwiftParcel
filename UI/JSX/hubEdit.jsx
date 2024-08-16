import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import { getAffectedRoutes, calculateNewRoute, updateRouteDetails } from './routeing.jsx'; // Import functions from routing

function Myparam(Il) {
  return (props) => <Il {...props} params={useParams()} loc={useLocation()} navigate={useNavigate()} />;
}

class HubEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      hub: {},
      hubs: [], // State to hold the list of active hubs
      invalidFields: {},
      error: null,
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.loadData();
    this.loadHubs(); // Ensure we load hubs when component mounts
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
      this.loadHubs(); // Reload hubs if the ID changes
    }
  }

  onChange(event) {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      hub: { ...prevState.hub, [name]: value },
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { hub } = this.state;
    const rowId1 = parseInt(this.props.params.id);
    hub.isActive = parseInt(hub.isActive);
    const { id, ...changes } = hub;

    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation hubUpdate($hub: HubUpdateInputs!) {
            hubUpdate(hub: $hub) {
                Name
                StreetNo
                City
                State
                Country
                PostalCode
                isActive
            }
          }`,
          variables: { hub: { id: rowId1, ...changes } },
        }),
      });

      const result = await response.json();
      if (result.data && result.data.hubUpdate) {
        this.setState({ hub: result.data.hubUpdate });
        alert('Updated hub successfully');

        // Load hubs again to ensure we have the latest data
        await this.loadHubs();

        const affectedRoutes = await getAffectedRoutes(rowId1);

        if (affectedRoutes.length === 0) {
          console.log("No affected routes found.");
          return;
        }

        // Process each affected route
        for (const route of affectedRoutes) {
          const { currentLocation, destination, trackingID } = route;

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

          // Update the route details in the database
          await updateRouteDetails(trackingID, newRouteDetails);
        }

        // Navigate to the admin hub list page
        this.props.navigate('/adminhublist');
      } else {
        throw new Error('No data returned from the server');
      }
    } catch (error) {
      console.error('Error updating hub:', error);
      this.setState({ error: 'Failed to update hub' });
    }
  }

  async loadData() {
    const id = parseInt(this.props.params.id);
    const query = `query getDetailsForUpdate($id: Int!) {
      hubdetailsList(id: $id) {
          id,
          Name,
          StreetNo,
          City,
          State,
          Country,
          PostalCode,
          isActive,
      }
    }`;

    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { id } }),
      });

      const result = await response.json();
      if (result.data && result.data.hubdetailsList.length > 0) {
        this.setState({ hub: result.data.hubdetailsList[0] });
      }
    } catch (error) {
      console.error('Error fetching hub details:', error);
      this.setState({ error: 'Failed to fetch hub details' });
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
      if (data.data && data.data.hubList) {
        this.setState({ hubs: data.data.hubList });
      }
    } catch (error) {
      console.error('Error fetching hubs:', error);
      this.setState({ error: 'Failed to fetch hubs' });
    }
  }

  render() {
    const inputstyles = {
      width: '100%',
      padding: '12px 20px',
      margin: '8px 0',
      display: 'inline-block',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxSizing: 'border-box',
    };
    const submitstyles = {
      width: '100%',
      backgroundColor: 'black',
      color: 'white',
      padding: '14px 20px',
      margin: '8px 0',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    };

    const {
      hub: { Name, StreetNo, City, State, Country, PostalCode, isActive },
      error,
    } = this.state;

    const rowId = this.props.params.id;

    if (rowId == null) {
      return <h3>{`Hub with ID ${rowId} not found.`}</h3>;
    }

    return (
      <form onSubmit={this.handleSubmit} style={{ maxWidth: '400px', margin: 'auto', marginTop: '60px' }}>
        <div>
          <label htmlFor='Name'>Name:</label>
          <input
            type='text'
            id='Name'
            name='Name'
            value={Name || ''}
            onChange={this.onChange}
            placeholder='Enter Name'
            style={inputstyles}
          />
        </div>
        <div>
          <label htmlFor='StreetNo'>StreetNo:</label>
          <input
            type='text'
            id='StreetNo'
            name='StreetNo'
            value={StreetNo || ''}
            onChange={this.onChange}
            placeholder='Enter StreetNo'
            style={inputstyles}
          />
        </div>
        <div>
          <label htmlFor='City'>City:</label>
          <input
            type='text'
            id='City'
            name='City'
            value={City || ''}
            onChange={this.onChange}
            placeholder='Enter City'
            style={inputstyles}
          />
        </div>
        <div>
          <label htmlFor='State'>State:</label>
          <input
            type='text'
            id='State'
            name='State'
            value={State || ''}
            onChange={this.onChange}
            style={inputstyles}
          />
        </div>
        <div>
          <label htmlFor='Country'>Country:</label>
          <input
            type='text'
            id='Country'
            name='Country'
            value={Country || ''}
            onChange={this.onChange}
            style={inputstyles}
          />
        </div>
        <div>
          <label htmlFor='PostalCode'>PostalCode:</label>
          <input
            type='text'
            id='PostalCode'
            name='PostalCode'
            value={PostalCode || ''}
            onChange={this.onChange}
            style={inputstyles}
          />
        </div>
        <div>
          <label htmlFor='Status'>Status:</label>
          <select
            id='isActive'
            name='isActive'
            style={inputstyles}
            value={isActive || ''}
            onChange={this.onChange}
          >
            <option value='1'>Active</option>
            <option value='0'>Inactive</option>
          </select>
        </div>
        <div style={{ color: 'red' }}>{error}</div>
        <div>
          <button type='submit' style={submitstyles}>
            Update Hub
          </button>
        </div>
      </form>
    );
  }
}

export default Myparam(HubEdit);