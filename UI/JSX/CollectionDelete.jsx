import React from 'react';
import { Link } from 'react-router-dom';

import { useLocation, useParams } from 'react-router-dom';

function Myparam(Il) {
  return (props) => <Il {...props} params={useParams()} loc={useLocation()} />;
}
class CollectionDelete extends React.Component {
  constructor() {
    super();
    this.state = {
      collection: {},
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
    const { collection } = this.state;
    const currentId1 = parseInt(this.props.params.id);
    const { id, ...changes } = collection; // Removing id from the object

    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation collectionDelete($collection: CollectionDeleteInputs!) {
           collectionDelete(collection: $collection) {
              id
              isDeleted
            }
          }`,
          variables: { collection: { id: currentId1, ...changes } },
        }),
      });

      const result = await response.json();

      if (result.data && result.data.collectionDelete) {
        this.setState({ collection: result.data.collectionDelete });
        alert('Collection deleted successfully');
        this.props.navigate('/AdminCollectionList');
      } 
      else if(result.data === null){
        alert(' CANNOT DELETE COLLECTION AS STATUS IS ACTIVE');
        this.props.navigate('/AdminCollectionList');
      }
      else {
        throw new Error('No data returned from the server');
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      // Handle error
    }
  }
  onChange(event) {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      collection: { ...prevState.collection, [name]: value },
    }));
  }

  render() {
    console.log(this.props);
    const {
      collection: { id },
    } = this.state;
    const currentId = this.props.params.id;

    if (currentId == null) {
      if (typeof this.props.params !== 'undefined') {
        return <h3>{`Collection with ID ${currentId} not found.`}</h3>;
      }
      return null;
    }
    const currentId1 = parseInt(this.props.params.id);
    const {
      collection: { name,city },
    } = this.state;
    return <></>;
  }
}

export default Myparam(CollectionDelete);
