import React, { Component } from "react";
import { useNavigate,Routes, Route, } from 'react-router-dom';
import ReactDOM from 'react-dom';
import CollectionCreation from './CollectionCreation.jsx';
import CollectionTable from './CollectionTable.jsx';
import AdminLayout from "./AdminLayout.jsx";

export default class CollectionList extends React.Component {
  constructor() {
    super();
    this.state = { collectiondetails: [] };
  }
  componentDidMount() {
    this.loadData();
  }
  async loadData() {
    console.log("in loadData..")
    const query = `query {
        collectionList {
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
    this.setState({ collectiondetails: result.data.collectionList }); //json data format in https://studio.apollographql.com/sandbox/explorer
    // },500);
  }
  
  async createCollection(collectionData) {
    console.log("................collectionData..."+collectionData.Name)
    const query = `
       mutation {
         addCollection(collection: {
           Name: "${collectionData.Name}"
           StreetNo: "${collectionData.StreetNo}"
           City: "${collectionData.City}"
           State: "${collectionData.State}"
           Country: "${collectionData.Country}"
           PostalCode: "${collectionData.PostalCode}"
           isDeleted: ${collectionData.isDeleted}
           isActive: ${collectionData.isActive}
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
 
    
     
    this.loadData();
  }

  

  render() {
    return (
      <AdminLayout>
      <div>
      <CollectionCreation createCollection={this.createCollection.bind(this)} />
        <h1 style={{ textAlign: 'center', marginTop:'30px' }}>Our Collection Centers</h1>
        <CollectionTable data={this.state.collectiondetails} />
      
      </div>
      </AdminLayout>
    );
  }
}
