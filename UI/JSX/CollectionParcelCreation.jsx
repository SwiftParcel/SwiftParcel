import React from 'react';


export default class CollectionParcelCreation extends React.Component {
  constructor() {
    super();
    this.state = {
      error: '',
    };
  }

  onAddCollectionParcel = async (e) => {
    e.preventDefault();
    const form = document.forms.createCollectionParcelForm;

    const ParcelHeight = form.ParcelHeight.value.trim();
    const ParcelLength = form.ParcelLength.value.trim();
    const ParcelWidth = form.ParcelWidth.value.trim();
    const ParcelWeight = form.ParcelWeight.value.trim();
    const ParcelOrigin = form.ParcelOrigin.value.trim();
    const ParcelDestination = form.ParcelDestination.value.trim();
    const ParcelSenderName = form.ParcelSenderName.value.trim();
    const ParcelCurrentLocation = form.ParcelOrigin.value.trim();
    const ParcelCurrentTime = new Date();

    this.setState({ error: '' });

    if (!ParcelHeight || !ParcelLength || !ParcelWidth || !ParcelWeight || !ParcelOrigin || !ParcelDestination || !ParcelSenderName) {
      this.setState({ error: 'All fields are required' });
      return;
    }

    let trackingId = Math.random().toString(36).substr(2, 8);
    console.log(".........trackingId......."+trackingId);

    const parcelData = {
      ParcelHeight: parseInt(ParcelHeight, 10),
      ParcelLength: parseInt(ParcelLength, 10),
      ParcelWidth: parseInt(ParcelWidth, 10),
      ParcelWeight: parseInt(ParcelWeight, 10),
      ParcelStatus: "Ready To Dispatch",
      ParcelOrigin,
      ParcelDestination,
      ParcelSenderName,
      ParcelTrackingId: trackingId,
      ParcelCurrentLocation,
      ParcelCurrentTime,
      
    };

    this.props.createCollectionParcel(parcelData);
    form.reset();
  };

  
async createParcelHistory(ParcelData) {
    
     var status="In transist";
     if(ParcelData.ParcelCurrentLocation===ParcelData.ParcelDestination){
      status="Out for delivery";
     }
      // Prepare parcel data
      const parcelHistoryData = {
        ParceltrackingID: ParcelData.ParcelTrackingId,
        ParcelcurrentLocation: ParcelData.ParcelCurrentLocation,
        Parcelcurrenttime: ParcelData.ParcelCurrentTime,
        Parcelstatus: status,
      };
      console.log('ParcelData:', ParcelData);
     
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
            <label htmlFor='ParcelHeight'>Parcel Height:</label>
            <input
              type='number'
              id='ParcelHeight'
              name='ParcelHeight'
              placeholder='Enter Parcel Height'
              style={inputstyles}
            />
          </div>
          <div>
            <label htmlFor='ParcelLength'>Parcel Length:</label>
            <input
              type='number'
              id='ParcelLength'
              name='ParcelLength'
              placeholder='Enter Parcel Length'
              style={inputstyles}
            />
          </div>
          <div>
            <label htmlFor='ParcelWidth'>Parcel Width:</label>
            <input
              type='number'
              id='ParcelWidth'
              name='ParcelWidth'
              placeholder='Enter Parcel Width'
              style={inputstyles}
            />
          </div>
          <div>
            <label htmlFor='ParcelWeight'>Parcel Weight:</label>
            <input
              type='number'
              id='ParcelWeight'
              name='ParcelWeight'
              placeholder='Enter Parcel Weight'
              style={inputstyles}
            />
          </div>
          <div>
            <label htmlFor='ParcelOrigin'>Parcel Origin:</label>
            <input
              type='text'
              id='ParcelOrigin'
              name='ParcelOrigin'
              placeholder='Enter Parcel Origin'
              style={inputstyles}
            />
          </div>
          <div>
            <label htmlFor='ParcelDestination'>Parcel Destination:</label>
            <input
              type='text'
              id='ParcelDestination'
              name='ParcelDestination'
              placeholder='Enter Parcel Destination'
              style={inputstyles}
            />
          </div>
          <div>
            <label htmlFor='ParcelSenderName'>Parcel Sender Name:</label>
            <input
              type='text'
              id='ParcelSenderName'
              name='ParcelSenderName'
              placeholder='Enter Parcel Sender Name'
              style={inputstyles}
            />
          </div>
          <button type='submit' style={submitstyles}>
            Add Parcel
          </button>
          {this.state.error && (
            <div style={{ color: 'red', marginTop: '10px' }}>{this.state.error}</div>
          )}
        </form>
      </>
    );
  }
}