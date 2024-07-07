import React, { Component } from "react";
import { useNavigate,Routes, Route, } from 'react-router-dom';
import ReactDOM from 'react-dom';
import HubCreation from './hubCreation.jsx';
import HubTable from './HubTable.jsx';
import AdminLayout from "./AdminLayout.jsx";

export default class HubList extends React.Component {
  constructor() {
    super();
    this.state = { hubdetails: [] };
  }
  componentDidMount() {
    this.loadData();
  }
  async loadData() {
    const query = `query {
        hubList {
          id,
          Name,
          StreetNo,
          City,
          State,
          Country,
          PostalCode,
          isDeleted,
          isActive,
           
        }
      }`;
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    // setTimeout(()=>{
    this.setState({ hubdetails: result.data.hubList }); //json data format in https://studio.apollographql.com/sandbox/explorer
    // },500);
  }
  
  async createHub(hubData) {
    console.log("................hubData..."+hubData.Name)
    const query = `
       mutation {
         addHub(hub: {
           Name: "${hubData.Name}"
           StreetNo: "${hubData.StreetNo}"
           City: "${hubData.City}"
           State: "${hubData.State}"
           Country: "${hubData.Country}"
           PostalCode: "${hubData.PostalCode}"
           isDeleted: ${hubData.isDeleted}
           isActive: ${hubData.isActive}
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
         }
       }
     `;
 
     const response = await fetch('http://localhost:8000/graphql', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ query }),
     });
 
    //  const result = await response.json();
    //  if (result.errors) {
    //    this.setState({ success: '', error: result.errors[0].message });
    //  } else {
    //    this.setState({ success: 'Hub added successfully', error: '' });
       
    //  }
     
    this.loadData();
  }

  

  render() {
    return (
      <AdminLayout>
      <div>
        <HubCreation createHub={this.createHub.bind(this)} />
        <h1 style={{ textAlign: 'center', marginTop:'30px' }}>Our Hubs</h1>
        <HubTable data={this.state.hubdetails} />
        
      </div>
      </AdminLayout>
    );
  }
}
