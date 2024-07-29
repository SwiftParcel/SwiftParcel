import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';

function Myparam(Il) {
  return (props) => <Il {...props} params={useParams()} loc={useLocation()} />;
}
class HubParcelEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      collectionParcel: {},
      invalidFields: {},
      hubs: [],
      
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.loadData();
    this.loadHubs();
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
    }
  }
  onChange(event) {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      collectionParcel: { ...prevState.collectionParcel, [name]: value },
    }));
  }
  async loadHubs() {
    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
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
          `
        }),
      });

      const result = await response.json();

      this.setState({ hubs: result.data.hubList });
    } catch (error) {
      console.error('Error fetching hubs:', error.message);
      this.setState({ error: 'Failed to fetch hubs' });
    }
  }

  
  async handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.hubEditForm;
    const { collectionParcel } = this.state;
    // const rowId1 = this.props.params.id;
    const rowId1 = parseInt(this.props.params.id);
    collectionParcel.ParcelHeight = parseInt(collectionParcel.ParcelHeight);
    collectionParcel.ParcelLength = parseInt(collectionParcel.ParcelLength);
    collectionParcel.ParcelWidth = parseInt(collectionParcel.ParcelWidth);
    collectionParcel.ParcelWeight = parseInt(collectionParcel.ParcelWeight);
    //collectionParcel.ParcelCurrentLocation=form.value.ParcelCurrentLocation;
    console.log(".............collectionParcel.ParcelCurrentLocation...."+collectionParcel.ParcelCurrentLocation);
    // const rowId1 = this.props.params.id; // Assigning the value to rowId1
    const { id, ...changes } = collectionParcel; // Removing id from the object

    console.log(' in handle submit1', rowId1);
    console.log(' in handle submit2', changes);
    console.log('Value of $id:', parseInt(rowId1));

    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation collectionParcelUpdate($collectionParcel: CollectionParcelUpdateInputs!) {
            collectionParcelUpdate(collectionParcel: $collectionParcel) {
                  ParcelHeight
                  ParcelLength
                  ParcelWidth
                  ParcelWeight
                  ParcelOrigin
                  ParcelDestination
                  ParcelSenderName
                  ParcelCurrentLocation
                 
            }
          }`,
          variables: { collectionParcel: { id: rowId1, ...changes } },
        }),
      });
      console.log('id bbbbbbbbb', collectionParcel);
      const result = await response.json();
      console.log('rrr', result);
      if (result.data && result.data.collectionParcelUpdate) {
        this.setState({ collectionParcel: result.data.collectionParcelUpdate });
        alert('Updated parcel successfully');
        this.props.navigate('/hubparcelList');
      } else {
        throw new Error('No data returned from the server');
      }
    } catch (error) {
      console.error('Error updating parcel details:', error);
      // Handle error
    }
  }

  getDetailsForUpdate = (collectionParcel) => {
    const id = parseInt(collectionParcel.id);
    this.detailsCollectionParcelData(id);
  };
  async loadData() {
    const id = parseInt(this.props.params.id);

    console.log('idddd', id);
    const query = `query getDetailsForUpdate($id: Int!) {
      collectionParceldetailsList(id: $id) {
          id,
          ParcelHeight,
           ParcelLength,
           ParcelWidth,
           ParcelWeight,
           ParcelOrigin,
           ParcelDestination,
           ParcelSenderName,
           ParcelCurrentLocation,
      }

      }`;
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id } }),
    });
    const result = await response.json();
    console.log('display', result);
    console.log('display', result.data.collectionParceldetailsList[0]);
    this.setState({ collectionParcel: result.data.collectionParceldetailsList[0] });
    
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
    console.log(this.props);
    const {
      collectionParcel: { id },
    } = this.state;
    const rowId = this.props.params.id;
    console.log('rowId', +rowId);
    {
    }
    if (rowId == null) {
      if (typeof this.props.params !== 'undefined') {
        return <h3>{`Parcel with ID ${rowId} not found.`}</h3>;
      }
      return null;
    }
    const rowId1 = parseInt(this.props.params.id);
    const {
      collectionParcel: {
        ParcelHeight,
           ParcelLength,
           ParcelWidth,
           ParcelWeight,
           ParcelOrigin,
           ParcelDestination,
           ParcelSenderName,
           ParcelCurrentLocation,
        
      },
    } = this.state;
    return (
      <form
        onSubmit={this.handleSubmit} name='hubEditForm'
        style={{ maxWidth: '400px', margin: 'auto', marginTop: '60px' }}
      >
        <div>
          <label htmlFor='ParcelHeight'>ParcelHeight:</label>
          <input
            type='number'
            id='ParcelHeight'
            name='ParcelHeight'
            value={ParcelHeight}
            onChange={this.onChange}
            placeholder='Enter ParcelHeight'
            style={inputstyles}
            
          />
        </div>
        <div>
          <label htmlFor='ParcelLength'>ParcelLength:</label>
          <input
            type='number'
            id='ParcelLength'
            name='ParcelLength'
            value={ParcelLength}
            onChange={this.onChange}
            placeholder='Enter ParcelLength'
            style={inputstyles}
            
          />
        </div>
        <div>
          <label htmlFor='ParcelWidth'>ParcelWidth:</label>
          <input
            type='number'
            id='ParcelWidth'
            name='ParcelWidth'
            value={ParcelWidth}
            onChange={this.onChange}
            placeholder='Enter ParcelWidth'
            style={inputstyles}
            
          />
        </div>
        <div>
          <label htmlFor='ParcelWeight'>ParcelWeight:</label>
          <input
            type='number'
            id='ParcelWeight'
            name='ParcelWeight'
            value={ParcelWeight}
            onChange={this.onChange}
            style={inputstyles}
            
          />
        </div>
        <div>
          <label htmlFor='ParcelOrigin'>ParcelOrigin:</label>
          <input
            type='text'
            id='ParcelOrigin'
            name='ParcelOrigin'
            value={ParcelOrigin}
            onChange={this.onChange}
            style={inputstyles}
            
          />
        </div>
        <div>
          <label htmlFor='ParcelDestination'>ParcelDestination:</label>
          <input
            type='text'
            id='ParcelDestination'
            name='ParcelDestination'
            value={ParcelDestination}
            onChange={this.onChange}
            style={inputstyles}
            
          />
        </div>
        <div>
          <label htmlFor='ParcelSenderName'>ParcelSenderName:</label>
          <input
            type='text'
            id='ParcelSenderName'
            name='ParcelSenderName'
            value={ParcelSenderName}
            onChange={this.onChange}
            style={inputstyles}
            
          />
        </div>
        <div>
        <label htmlFor='ParcelCurrentLocation'>ParcelCurrentLocation:</label>
        <select name="ParcelCurrentLocation" id="ParcelCurrentLocation"  
         value={ParcelCurrentLocation}
        onChange={this.onChange}
        style={inputstyles}
        className="employee-select">
          <option value={ParcelOrigin}>{ParcelOrigin}</option>
          {this.state.hubs.map((hub) => (
            <option key={hub.id} value={hub.Name} >
              {hub.Name}
            </option>
          ))}
          <option value={ParcelDestination}>{ParcelDestination}</option>
        </select>
        </div>
        <div style={{ color: 'red' }}>{this.state.error}</div>
        <div>
          <button type='submit' style={submitstyles}>
            Update Parcel
          </button>
        </div>
      </form>
    );
  }
}

export default Myparam(HubParcelEdit);
