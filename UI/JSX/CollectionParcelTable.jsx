import React from 'react';
import { Link } from 'react-router-dom';

class CollectionParcelRow extends React.Component {
  render() {
    return (
      <tr key={this.props.collectionParceldata.id}>
        <td className='p-3'>{this.props.collectionParceldata.id}</td>
        <td className='p-3'>{this.props.collectionParceldata.ParcelHeight}</td>
        <td className='p-3'>{this.props.collectionParceldata.ParcelLength}</td>
        <td className='p-3'>{this.props.collectionParceldata.ParcelWidth}</td>
        <td className='p-3'>{this.props.collectionParceldata.ParcelWeight}</td>
        <td className='p-3'>{this.props.collectionParceldata.ParcelStatus}</td>
        <td className='p-3'>{this.props.collectionParceldata.ParcelOrigin}</td>
        <td className='p-3'>{this.props.collectionParceldata.ParcelDestination}</td>
        <td className='p-3'>{this.props.collectionParceldata.ParcelSenderName}</td>
        <td className='p-3'>{this.props.collectionParceldata.ParcelTrackingId}</td>
        <td className='p-3'>{this.props.collectionParceldata.ParcelCurrentLocation}</td>
        <td className='p-3'>
         
          <Link
            to={`/editCollectionParcel/${this.props.collectionParceldata.id}`}
            className='btn btn-primary me-2'
          >
            Edit
          </Link>
          
        </td>
      </tr>
    );
  }
}

export default class CollectionParcelTable extends React.Component {
  render() {
    const result = this.props.data.map((c, index) => (
      <CollectionParcelRow key={c.id} collectionParceldata={c} index={index} />
    ));
    return (
      <div className='parcel-container'>
        <div className='row'>
          <div className='col'>
            <table className='table table-striped table-secondary'>
              <thead className='table-dark'>
                <tr>
                  <th className='p-3'>Sr No</th>
                  <th className='p-3'>Parcel Height</th>
                  <th className='p-3'>Parcel Length</th>
                  <th className='p-3'>Parcel Width</th>
                  <th className='p-3'>Parcel Weight</th>
                  <th className='p-3'>Parcel Status</th>
                  <th className='p-3'>Parcel Origin</th>
                  <th className='p-3'>Parcel Destination</th>
                  <th className='p-3'>Parcel SenderName</th>
                  <th className='p-3'>Parcel TrackingId</th>
                  <th className='p-3'>Parcel Current Location</th>
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
