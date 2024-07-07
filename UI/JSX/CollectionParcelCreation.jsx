import React from 'react';
export default class CollectionParcelCreation extends React.Component {
  constructor() {
    super();
    this.state = {
      error: '',
    };
  }

  onAddCollectionParcel = (e) => {
    e.preventDefault();
        const form = document.forms.createCollectionParcelForm;

    const ParcelHeight = form.ParcelHeight.value.trim();
    console.log("in ParcelHeight"+ParcelHeight)
    const ParcelLength = form.ParcelLength.value.trim();
    const ParcelWidth = form.ParcelWidth.value.trim();
    const ParcelWeight = form.ParcelWeight.value.trim();
    const ParcelOrigin = form.ParcelOrigin.value.trim();
    const ParcelDestination = form.ParcelDestination.value.trim();
    const ParcelSenderName =form.ParcelSenderName.value.trim();

    this.setState({ error: '' });
  

    // Check if any of the required fields is empty
    if (!ParcelHeight || !ParcelLength || !ParcelWidth || !ParcelWeight || !ParcelOrigin || !ParcelDestination || !ParcelSenderName) {
      this.setState({ error: 'All fields are required' });
      return;
    }

    
    this.setState({ error: '' });

    let trackingId = Math.random().toString(36).split('').filter( function(value, index, self) { 
      return self.indexOf(value) === index;
  }).join('').substr(2,8);

  console.log(".........trackingId......."+trackingId);
    let collectionParceldata = {
      ParcelHeight: form.ParcelHeight.value,
      ParcelLength: form.ParcelLength.value,
      ParcelWidth: form.ParcelWidth.value,
      ParcelWeight: form.ParcelWeight.value,
      ParcelStatus: "Ready To Dispatch",
      ParcelOrigin: form.ParcelOrigin.value,
      ParcelDestination: form.ParcelDestination.value,
      ParcelSenderName:form.ParcelSenderName.value,
      ParcelTrackingId: trackingId,
      
    };
    form.reset();
    this.props.createCollectionParcel(collectionParceldata);
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
        <h2 style={{ textAlign: 'center' }}>Add New Parcel</h2>
        <form
          name='createCollectionParcelForm'
          onSubmit={this.onAddCollectionParcel}
          style={{ maxWidth: '400px', margin: 'auto', marginTop: '60px' }}
        >
          <div>
            <label htmlFor='ParcelHeight'>ParcelHeight:</label>
            <input
              type='number'
              id='ParcelHeight'
              name='ParcelHeight'
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
              style={inputstyles}
            />
          </div>
          <div>
          <label htmlFor='ParcelOrigin'>ParcelOrigin:</label>
            <input
              type='text'
              id='ParcelOrigin'
              name='ParcelOrigin'
              style={inputstyles}
            />
          </div>
          <div>
          <label htmlFor='ParcelDestination'>ParcelDestination:</label>
            <input
              type='text'
              id='ParcelDestination'
              name='ParcelDestination'
              style={inputstyles}
            />
          </div>
          <div>
          <label htmlFor='ParcelSenderName'>ParcelSenderName:</label>
            <input
              type='text'
              id='ParcelSenderName'
              name='ParcelSenderName'
              style={inputstyles}
            />
          </div>
          <div style={{ color: 'red' }}>{this.state.error}</div>
          <div>
            <button type='submit' style={submitstyles}>
              Add Package
            </button>
          </div>
        </form>
      </>
    );
  }
}
