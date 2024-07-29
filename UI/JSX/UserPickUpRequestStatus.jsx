import React, { Component,useState } from "react";
import { useNavigate,Routes, Route, } from 'react-router-dom';
import ReactDOM from 'react-dom';
import HubCreation from './hubCreation.jsx';
import HubTable from './HubTable.jsx';
import AdminLayout from "./AdminLayout.jsx";
class HubParcelRow extends React.Component {
  render() {
    return (
      <tr key={this.props.requestdetails.id}>
        <td className='p-3'>{this.props.requestdetails.id}</td>
        <td className='p-3'>{this.props.requestdetails.RequestStatus}</td>
            
      </tr>
    );
  }
}
export default class UserPickUpRequestStatus extends React.Component {
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
    
    const query = `query requestdetails($loginId: String!) {
      requestdetails(loginId: $loginId) {
          id,
          RequestStatus,
  
      }
    
}`;
const response = await fetch('http://localhost:8000/graphql', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ query, variables: { loginId } }),
});
const result = await response.json();
console.log('display..........', result);
console.log('display.........', result.data.requestdetails);
this.setState({ userRequestdetails: result.data.requestdetails });
console.log('userRequestdetails........', this.state.userRequestdetails);
    } catch (error) {
      console.error('Error ', error);
      return false;
    }
    
    
    
  }
  render() {
    const result = this.state.userRequestdetails.map((c, index) => (
      <HubParcelRow key={c.id} requestdetails={c} index={index} />
    ));
    return (
      <div className='parcel-container'>
        <div className='row'>
          <div className='col'>
            <table className='table table-striped table-secondary'>
              <thead className='table-dark'>
                <tr>
                  <th className='p-3'>Sr No</th>
                  <th className='p-3'>Request Status</th>
                  
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
