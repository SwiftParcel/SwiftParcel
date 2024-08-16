import React, { Component } from "react";
import { useNavigate, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import CollectionParcelCreation from './CollectionParcelCreation.jsx';
import HubParcelTable from './HubParcelTable.jsx';
import axios from 'axios';
import { isPointInPolygon } from 'geolib';

export default class HubParcelList extends React.Component {
  constructor() {
    super();
    this.state = { collectionParceldetails: [], hubs: [] };
  }

  componentDidMount() {
    this.loadData();
    this.loadHubs();
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
          ParcelCurrentLocation,
          ParcelCurrentTime,
        }
      }`;
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    this.setState({ collectionParceldetails: result.data.collectionParcelList });
  }

  async loadHubs() {
    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              hubList {
                id
                Name
                StreetNo
                City
                State
                Country
                isActive
              }
            }
          `
        }),
      });

      const data = await response.json();
      this.setState({ hubs: data.data.hubList });
    } catch (error) {
      console.error('Error fetching hubs:', error.message);
      this.setState({ error: 'Failed to fetch hubs' });
    }
  }

  
  
  render() {
    return (
      <div>
        <h1 style={{ textAlign: 'center', marginTop: '30px' }}>All Parcels</h1>
        <HubParcelTable data={this.state.collectionParceldetails} />
      </div>
    );
  }
}