import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';

function Myparam(Il) {
  return (props) => <Il {...props} params={useParams()} loc={useLocation()} />;
}
class hubEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      hub: {},
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
      hub: { ...prevState.hub, [name]: value },
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { hub } = this.state;
    // const rowId1 = this.props.params.id;
    const rowId1 = parseInt(this.props.params.id);
    hub.isActive = parseInt(hub.isActive);
    // const rowId1 = this.props.params.id; // Assigning the value to rowId1
    const { id, ...changes } = hub; // Removing id from the object

    console.log(' in handle submit1', rowId1);
    console.log(' in handle submit2', changes);
    console.log('Value of $id:', parseInt(rowId1));

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
      console.log('id bbbbbbbbb', hub);
      const result = await response.json();
      console.log('rrr', result);
      if (result.data && result.data.hubUpdate) {
        this.setState({ hub: result.data.hubUpdate });
        alert('Updated hub successfully');
        this.props.navigate('/adminhublist');
      } else {
        throw new Error('No data returned from the server');
      }
    } catch (error) {
      console.error('Error updating hub:', error);
      // Handle error
    }
  }

  getDetailsForUpdate = (hub) => {
    const id = parseInt(hub.id);
    this.detailsData(id);
  };
  async loadData() {
    const id = parseInt(this.props.params.id);

    console.log('idddd', id);
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
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id } }),
    });
    const result = await response.json();
    console.log('display', result);
    console.log('display', result.data.hubdetailsList[0]);
    this.setState({ hub: result.data.hubdetailsList[0] });
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
      hub: { id },
    } = this.state;
    const rowId = this.props.params.id;
    console.log('rowId', +rowId);
    {
    }
    if (rowId == null) {
      if (typeof this.props.params !== 'undefined') {
        return <h3>{`Hub with ID ${rowId} not found.`}</h3>;
      }
      return null;
    }
    const rowId1 = parseInt(this.props.params.id);
    const {
      hub: {
        Name,
        StreetNo,
        City,
        State,
        Country,
        PostalCode,
        isActive,
        
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
          <label htmlFor='Status'>Status:</label>
          <select
            id='isActive'
            name='isActive'
            style={inputstyles}
            value={isActive}
            onChange={this.onChange}
          >
            <option value='1'>Active</option>
            <option value='0'>InActive</option>
          </select>
        </div>
        <div style={{ color: 'red' }}>{this.state.error}</div>
        <div>
          <button type='submit' style={submitstyles}>
            Update Hub
          </button>
        </div>
      </form>
    );
  }
}

export default Myparam(hubEdit);
