import React from 'react';
import { Link } from 'react-router-dom';

import { useLocation, useParams } from 'react-router-dom';

function Myparam(Il) {
  return (props) => <Il {...props} params={useParams()} loc={useLocation()} />;
}
class HubDelete extends React.Component {
  constructor() {
    super();
    this.state = {
      hub: {},
      invalidFields: {},
    };
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    this.loadData();
  }
  componentDidUpdate(prevProps) {
    const {
      params: { id: prevId },
    } = prevProps;
    const {
      params: { id },
    } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }
  async loadData() {
    const { hub } = this.state;
    const currentId1 = parseInt(this.props.params.id);
    const { id, ...changes } = hub; // Removing id from the object

    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation hubDelete($hub: HubDeleteInputs!) {
            hubDelete(hub: $hub) {
              id
              isDeleted
            }
          }`,
          variables: { hub: { id: currentId1, ...changes } },
        }),
      });

      const result = await response.json();

      if (result.data && result.data.hubDelete) {
        this.setState({ hub: result.data.hubDelete });
        alert('Hub deleted successfully');
        this.props.navigate('/adminhublist');
      } 
      else if(result.data === null){
        alert(' CANNOT DELETE HUB AS STATUS IS ACTIVE');
        this.props.navigate('/adminhublist');
      }
      else {
        throw new Error('No data returned from the server');
      }
    } catch (error) {
      console.error('Error deleting hub:', error);
      // Handle error
    }
  }
  onChange(event) {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      hub: { ...prevState.hub, [name]: value },
    }));
  }

  render() {
    console.log(this.props);
    const {
      hub: { id },
    } = this.state;
    const currentId = this.props.params.id;

    if (currentId == null) {
      if (typeof this.props.params !== 'undefined') {
        return <h3>{`hub with ID ${currentId} not found.`}</h3>;
      }
      return null;
    }
    const currentId1 = parseInt(this.props.params.id);
    const {
      hub: { name,city },
    } = this.state;
    return <></>;
  }
}

export default Myparam(HubDelete);
