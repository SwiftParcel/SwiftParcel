import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';

function Myparam(Il) {
  return (props) => <Il {...props} params={useParams()} loc={useLocation()} />;
}
class UserPickUpRequestStatusUpdate extends React.Component {
  constructor() {
    super();
    this.state = {
      collection: {},
      invalidFields: {},
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.loadData();
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
      collection: { ...prevState.collection, [name]: value },
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { collection } = this.state;
    // const rowId1 = this.props.params.id;
    const rowId1 = parseInt(this.props.params.id);
    // const rowId1 = this.props.params.id; // Assigning the value to rowId1
    const { id, ...changes } = collection; // Removing id from the object

    console.log(' in handle submit1', rowId1);
    console.log(' in handle submit2', changes);
    console.log('Value of $id:', parseInt(rowId1));

    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation collectionRequestUpdate($collection: CollectionRequestUpdateInputs!) {
            collectionRequestUpdate(collection: $collection) {
                
                Name
                StreetNo
                City
                State
                Country
                PostalCode
                RequestStatus
            }
          }`,
          variables: { collection: { id: rowId1, ...changes } },
        }),
      });
      console.log('id bbbbbbbbb', collection);
      const result = await response.json();
      console.log('rrr', result);
      if (result.data && result.data.collectionRequestUpdate) {
        this.setState({ collection: result.data.collectionRequestUpdate });
        alert('Updated collection successfully');
        this.props.navigate('/userRequestmanagement');
      } else {
        throw new Error('No data returned from the server');
      }
    } catch (error) {
      console.error('Error updating collection:', error);
      // Handle error
    }
  }

  getDetailsForUpdate = (collection) => {
    const id = parseInt(collection.id);
    this.getCollectionRequestDetailsForUpdate(id);
  };
  async loadData() {
    const id = parseInt(this.props.params.id);

    console.log('idddd', id);
    const query = `query getCollectionRequestDetailsForUpdate($id: Int!) {
      getCollectionRequestDetailsForUpdate(id: $id) {
          id,
          Name,
          StreetNo,
          City,
          State,
          Country,
          PostalCode,
          RequestStatus,
      }

      }`;
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id } }),
    });
    const result = await response.json();
    console.log('display', result);
    console.log('display', result.data.getCollectionRequestDetailsForUpdate[0]);
    this.setState({ collection: result.data.getCollectionRequestDetailsForUpdate[0] });
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
      collection: { id },
    } = this.state;
    const rowId = this.props.params.id;
    console.log('rowId', +rowId);
    {
    }
    if (rowId == null) {
      if (typeof this.props.params !== 'undefined') {
        return <h3>{`Collection Request with ID ${rowId} not found.`}</h3>;
      }
      return null;
    }
    const rowId1 = parseInt(this.props.params.id);
    const {
      collection: {
        Name,
        StreetNo,
        City,
        State,
        Country,
        PostalCode,
        RequestStatus,
        
      },
    } = this.state;
    return (
      <form
        onSubmit={this.handleSubmit}
        style={{ maxWidth: '400px', margin: 'auto', marginTop: '60px' }}
      >
        <div>
          <label htmlFor='Name'>Name:</label>
          <input
            type='text'
            id='Name'
            name='Name'
            value={Name}
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
            value={StreetNo}
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
            value={City}
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
            value={State}
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
            value={Country}
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
            value={PostalCode}
            onChange={this.onChange}
            style={inputstyles}
            
          />
        </div>
        <div>
          <label htmlFor='RequestStatus'>Request Status:</label>
          <select
            id='RequestStatus'
            name='RequestStatus'
            style={inputstyles}
            value={RequestStatus}
            onChange={this.onChange}
          >
            <option value='In Progress'>In Progress</option>
            <option value='Processed'>Processed</option>
          </select>
        </div>
        <div style={{ color: 'red' }}>{this.state.error}</div>
        <div>
          <button type='submit' style={submitstyles}>
            Update Request
          </button>
        </div>
      </form>
    );
  }
}

export default Myparam(UserPickUpRequestStatusUpdate);
