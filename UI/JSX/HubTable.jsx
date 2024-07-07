import React from 'react';
import { Link } from 'react-router-dom';

class HubRow extends React.Component {
  render() {
    return (
      <tr key={this.props.hubdata.id}>
        <td className='p-3'>{this.props.hubdata.id}</td>
        <td className='p-3'>{this.props.hubdata.Name}</td>
        <td className='p-3'>{this.props.hubdata.StreetNo}</td>
        <td className='p-3'>{this.props.hubdata.City}</td>
        <td className='p-3'>{this.props.hubdata.State}</td>
        <td className='p-3'>{this.props.hubdata.Country}</td>
        <td className='p-3'>{this.props.hubdata.PostalCode}</td>
        <td className='p-3'>
         
          <Link
            to={`/editHub/${this.props.hubdata.id}`}
            className='btn btn-primary me-2'
          >
            Edit
          </Link>
          <Link
            to={`/deleteHub/${this.props.hubdata.id}`}
            className='btn btn-danger'
          >
            Delete
          </Link>
        </td>
      </tr>
    );
  }
}

export default class HubTable extends React.Component {
  render() {
    const result = this.props.data.map((c, index) => (
      <HubRow key={c.id} hubdata={c} index={index} />
    ));
    return (
      <div className='hub-container'>
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
