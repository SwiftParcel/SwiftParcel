import React from 'react';
export default class CollectionCreation extends React.Component {
  constructor() {
    super();
    this.state = {
      error: '',
    };
  }

  onAddCollection = (e) => {
    e.preventDefault();
        const form = document.forms.createCollectionForm;

    const Name = form.Name.value.trim();
    console.log("in Name"+Name)
    const StreetNo = form.StreetNo.value.trim();
    const City = form.City.value.trim();
    const State = form.State.value.trim();
    const Country = form.Country.value.trim();
    const PostalCode = form.PostalCode.value.trim();
    

    this.setState({ error: '' });
  

    // Check if any of the required fields is empty
    if (!Name || !StreetNo || !City || !State || !Country || !PostalCode) {
      this.setState({ error: 'All fields are required' });
      return;
    }

    
    this.setState({ error: '' });

    let collectiondata = {
      Name: form.Name.value,
      StreetNo: form.StreetNo.value,
      City: form.City.value,
      State: form.State.value,
      Country: form.Country.value,
      PostalCode: form.PostalCode.value,
      isActive: 1,
      isDeleted: 1,
    };
    form.reset();
    this.props.createCollection(collectiondata);
  };

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
    return (
      <>
        <h2 style={{ textAlign: 'center' }}>Create A Collection Center</h2>
        <form
          name='createCollectionForm'
          onSubmit={this.onAddCollection}
          style={{ maxWidth: '400px', margin: 'auto', marginTop: '60px' }}
        >
          <div>
            <label htmlFor='Name'>Name:</label>
            <input
              type='text'
              id='Name'
              name='Name'
              placeholder='Enter Name'
              style={inputstyles}
            />
          </div>
          <div>
            <label htmlFor='StreetNo'>Street No:</label>
            <input
              type='text'
              id='StreetNo'
              name='StreetNo'
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
              style={inputstyles}
            />
          </div>
          <div>
          <label htmlFor='Country'>Country:</label>
            <input
              type='text'
              id='Country'
              name='Country'
              style={inputstyles}
            />
          </div>
          <div>
          <label htmlFor='PostalCode'>PostalCode:</label>
            <input
              type='text'
              id='PostalCode'
              name='PostalCode'
              style={inputstyles}
            />
          </div>
         
          <div style={{ color: 'red' }}>{this.state.error}</div>
          <div>
            <button type='submit' style={submitstyles}>
              Add Collection
            </button>
          </div>
        </form>
      </>
    );
  }
}
