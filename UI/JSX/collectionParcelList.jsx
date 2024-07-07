import React, { Component } from "react";
import { useNavigate,Routes, Route, } from 'react-router-dom';
import ReactDOM from 'react-dom';
import CollectionParcelCreation from './CollectionParcelCreation.jsx';
import CollectionParcelTable from './CollectionParcelTable.jsx';
import AdminLayout from "./AdminLayout.jsx";


export default class CollectionParcelList extends React.Component {
  constructor() {
    super();
    this.state = { collectionParceldetails: [] };
  }
  componentDidMount() {
    this.loadData();
  }
  async loadData() {
    const query = `query {
        collectionParcelList {
          id,
          ParcelHeight,
          ParcelLength,
          ParcelWidth,
          ParcelWeight,
          ParcelStatus,
          ParcelOrigin,
          ParcelDestination,
          ParcelSenderName,
          ParcelTrackingId,
           
        }
      }`;
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    // setTimeout(()=>{
    this.setState({ collectionParceldetails: result.data.collectionParcelList }); //json data format in https://studio.apollographql.com/sandbox/explorer
    // },500);
  }
  
  async createCollectionParcel(collectionParcelData) {
    console.log("................collectionParcelData..."+collectionParcelData.Name)
    const query = `
       mutation {
         addCollectionParcel(collectionParcel: {
           ParcelHeight: ${collectionParcelData.ParcelHeight}
           ParcelLength: ${collectionParcelData.ParcelLength}
           ParcelWidth: ${collectionParcelData.ParcelWidth}
           ParcelWeight: ${collectionParcelData.ParcelWeight}
           ParcelStatus: "${collectionParcelData.ParcelStatus}"
           ParcelOrigin: "${collectionParcelData.ParcelOrigin}"
           ParcelDestination: "${collectionParcelData.ParcelDestination}"
           ParcelSenderName: "${collectionParcelData.ParcelSenderName}"
           ParcelTrackingId: "${collectionParcelData.ParcelTrackingId}"
         }) {
           id
           ParcelHeight
           ParcelLength
           ParcelWidth
           ParcelWeight
           ParcelStatus
           ParcelOrigin
           ParcelDestination
           ParcelSenderName
           ParcelTrackingId
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
      
      <div>
      <CollectionParcelCreation createCollectionParcel={this.createCollectionParcel.bind(this)} />
        <h1 style={{ textAlign: 'center', marginTop:'30px' }}>All Parcels</h1>
        <CollectionParcelTable data={this.state.collectionParceldetails} />
      </div>
      
    );
  }
}
