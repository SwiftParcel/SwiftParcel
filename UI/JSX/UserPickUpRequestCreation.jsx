import React from 'react';
import './UserPickUpRequestCreation.css';

export default class UserPickUpRequestCreation extends React.Component {
  constructor() {
    super();
    this.state = {
      error: '',
    };
  }

  onAddRequest = async (e) => {
    e.preventDefault();
    const form = document.forms.createCollectionForm;

    const Name = form.Name.value.trim();
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
    const loginId = localStorage.getItem('loginId');
    let collectiondata = {
      Name: form.Name.value,
      StreetNo: form.StreetNo.value,
      City: form.City.value,
      State: form.State.value,
      Country: form.Country.value,
      PostalCode: form.PostalCode.value,
      isActive: 1,
      isDeleted: 1,
      log_id: loginId,
    };

    const query = `
       mutation {
         addCollectionRequest(collectionRequest: {
           Name: "${collectiondata.Name}"
           StreetNo: "${collectiondata.StreetNo}"
           City: "${collectiondata.City}"
           State: "${collectiondata.State}"
           Country: "${collectiondata.Country}"
           PostalCode: "${collectiondata.PostalCode}"
           isDeleted: ${collectiondata.isDeleted}
           isActive: ${collectiondata.isActive}
           log_id: "${collectiondata.log_id}"
         }) {
           id
           Name
           StreetNo
           City
           State
           Country
           PostalCode
           isDeleted
           isActive
           log_id
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
      alert("Error creating request");
    } else {
      alert("Request Created");
    }
    form.reset();
  };

  render() {
    return (
      <div className="pickupreq-container">
        <h2 className="pickupreq-title">Create Collection Request</h2>
        <form
          name='createCollectionForm'
          onSubmit={this.onAddRequest}
          className="pickupreq-form-card"
        >
          <div className="pickupreq-form-group">
            <label htmlFor='Name' className="pickupreq-label">Name:</label>
            <input
              type='text'
              id='Name'
              name='Name'
              placeholder='Enter Name'
              className="pickupreq-input"
            />
          </div>
          <div className="pickupreq-form-group">
            <label htmlFor='StreetNo' className="pickupreq-label">Street No:</label>
            <input
              type='text'
              id='StreetNo'
              name='StreetNo'
              placeholder='Enter Street No'
              className="pickupreq-input"
            />
          </div>
          <div className="pickupreq-form-group">
            <label htmlFor='City' className="pickupreq-label">City:</label>
            <input
              type='text'
              id='City'
              name='City'
              placeholder='Enter City'
              className="pickupreq-input"
            />
          </div>
          <div className="pickupreq-form-group">
            <label htmlFor='State' className="pickupreq-label">State:</label>
            <input
              type='text'
              id='State'
              name='State'
              className="pickupreq-input"
            />
          </div>
          <div className="pickupreq-form-group">
            <label htmlFor='Country' className="pickupreq-label">Country:</label>
            <input
              type='text'
              id='Country'
              name='Country'
              className="pickupreq-input"
            />
          </div>
          <div className="pickupreq-form-group">
            <label htmlFor='PostalCode' className="pickupreq-label">Postal Code:</label>
            <input
              type='text'
              id='PostalCode'
              name='PostalCode'
              className="pickupreq-input"
            />
          </div>
          <div className="pickupreq-error">{this.state.error}</div>
          <button type='submit' className="pickupreq-submit-button">
            Create Request
          </button>
        </form>
      </div>
    );
  }
}
