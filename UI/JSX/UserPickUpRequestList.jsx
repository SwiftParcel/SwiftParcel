import React, { Component,useState } from "react";
import { useNavigate,Routes, Route, } from 'react-router-dom';
import ReactDOM from 'react-dom';
import HubCreation from './hubCreation.jsx';
import HubTable from './HubTable.jsx';
import AdminLayout from "./AdminLayout.jsx";
import { Link } from 'react-router-dom';
class UserRow extends React.Component {
  render() {
    return (
      <tr key={this.props.requestdetails.id}>
        <td className='p-3'>{this.props.requestdetails.id}</td>
        <td className='p-3'>{this.props.requestdetails.Name}</td>
        <td className='p-3'>{this.props.requestdetails.StreetNo}</td>
        <td className='p-3'>{this.props.requestdetails.City}</td>
        <td className='p-3'>{this.props.requestdetails.State}</td>
        <td className='p-3'>{this.props.requestdetails.Country}</td>
        <td className='p-3'>{this.props.requestdetails.PostalCode}</td>
        <td className='p-3'>{this.props.requestdetails.RequestStatus}</td>
         
        <td className='p-3'>
         
          <Link
            to={`/editUserRequest/${this.props.requestdetails.id}`}
            className='btn btn-primary me-2'
          >
            Edit
          </Link>
          
        </td>
      </tr>
    );
  }
}
export default class UserPickUpRequestList extends React.Component {
  constructor() {
    super();
    this.state = { userRequestdetails: [] };
  }
  componentDidMount() {
    this.loadData();
  }
  async loadData() {
    try {
      const loginId=localStorage.getItem('loginId');
    
    const query = `query  {
      getUserRequestDetails{
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
body: JSON.stringify({ query }),
});
const result = await response.json();
console.log('display..........', result);
console.log('display.........', result.data.getUserRequestDetails);
this.setState({ userRequestdetails: result.data.getUserRequestDetails });
console.log('userRequestdetails........', this.state.userRequestdetails);
    } catch (error) {
      console.error('Error ', error);
      return false;
    }
    
    
    
  }
  render() {
    const result = this.state.userRequestdetails.map((c, index) => (
      <UserRow key={c.id} requestdetails={c} index={index} />
    ));
    return (
      <div className='parcel-container'>
        <div className='row'>
          <div className='col'>
            <table className='table table-striped table-secondary'>
              <thead className='table-dark'>
                <tr>
                  <th className='p-3'>Sr No</th>
                  <th className='p-3'>Name</th>
                  <th className='p-3'>StreetNo</th>
                  <th className='p-3'>City</th>
                  <th className='p-3'>State</th>
                  <th className='p-3'>Country</th>
                  <th className='p-3'>PostalCode</th>
                  <th className='p-3'>Request Status</th>
                  
                  <th className='p-3'>Actions</th>
                </tr>
              </thead>
              <tbody>{result}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
