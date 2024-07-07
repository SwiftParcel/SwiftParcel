import React from 'react';
import { Link } from 'react-router-dom';

class CollectionRow extends React.Component {
  render() {
    return (
      <tr key={this.props.collectiondata.id}>
        <td className='p-3'>{this.props.collectiondata.id}</td>
        <td className='p-3'>{this.props.collectiondata.Name}</td>
        <td className='p-3'>{this.props.collectiondata.StreetNo}</td>
        <td className='p-3'>{this.props.collectiondata.City}</td>
        <td className='p-3'>{this.props.collectiondata.State}</td>
        <td className='p-3'>{this.props.collectiondata.Country}</td>
        <td className='p-3'>{this.props.collectiondata.PostalCode}</td>
        <td className='p-3'>
         
          <Link
            to={`/editCollection/${this.props.collectiondata.id}`}
            className='btn btn-primary me-2'
          >
            Edit
          </Link>
          <Link
            to={`/deleteCollection/${this.props.collectiondata.id}`}
            className='btn btn-danger'
          >
            Delete
          </Link>
        </td>
      </tr>
    );
  }
}

export default class CollectionTable extends React.Component {
  render() {
    const result = this.props.data.map((c, index) => (
      <CollectionRow key={c.id} collectiondata={c} index={index} />
    ));
    return (
      <div className='collection-container'>
        <div className='row'>
          <div className='col'>
            <table className='table table-striped table-secondary'>
              <thead className='table-dark'>
                <tr>
                  <th className='p-3'>Sr No</th>
                  <th className='p-3'>Name</th>
                  <th className='p-3'>Street No</th>
                  <th className='p-3'>City</th>
                  <th className='p-3'>State</th>
                  <th className='p-3'>Country</th>
                  <th className='p-3'>Postal Code</th>
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
