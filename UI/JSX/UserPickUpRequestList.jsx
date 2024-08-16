import React from "react";
import { Link } from 'react-router-dom';
import './UserPickUpRequestList.css';

class UserRow extends React.Component {
  render() {
    return (
      <tr key={this.props.requestdetails.id} className="pickReq-row">
        <td className="pickReq-cell">{this.props.requestdetails.id}</td>
        <td className="pickReq-cell">{this.props.requestdetails.Name}</td>
        <td className="pickReq-cell">{this.props.requestdetails.StreetNo}</td>
        <td className="pickReq-cell">{this.props.requestdetails.City}</td>
        <td className="pickReq-cell">{this.props.requestdetails.State}</td>
        <td className="pickReq-cell">{this.props.requestdetails.Country}</td>
        <td className="pickReq-cell">{this.props.requestdetails.PostalCode}</td>
        <td className="pickReq-cell">{this.props.requestdetails.RequestStatus}</td>
        <td className="pickReq-cell pickReq-actions">
          <Link
            to={`/editUserRequest/${this.props.requestdetails.id}`}
            className="pickReq-btn pickReq-btn-primary"
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
      const loginId = localStorage.getItem('loginId');
      const query = `query {
        getUserRequestDetails {
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
      this.setState({ userRequestdetails: result.data.getUserRequestDetails });
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
      <div className="pickReq-container">
        <div className="pickReq-table-wrapper">
          <table className="pickReq-table">
            <thead className="pickReq-thead">
              <tr>
                <th className="pickReq-th">Sr No</th>
                <th className="pickReq-th">Name</th>
                <th className="pickReq-th">Street No</th>
                <th className="pickReq-th">City</th>
                <th className="pickReq-th">State</th>
                <th className="pickReq-th">Country</th>
                <th className="pickReq-th">Postal Code</th>
                <th className="pickReq-th">Request Status</th>
                <th className="pickReq-th">Actions</th>
              </tr>
            </thead>
            <tbody>{result}</tbody>
          </table>
        </div>
      </div>
    );
  }
}
