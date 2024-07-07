const fs = require('fs');
require('dotenv').config({ path: 'env.env' });
const {
  getNextSequence,
  getHubNextSequence,
  getCollectionParcelNextSequence,
  getCenterNextSequence,
  insertDbUser,
  getDbUser,
  getDbHubDetails,
  getDbCollectionParcelDetails,
  getDbCollectionDetails,
  insertHub,
  insertCollectionParcel,
  insertCenter,
  insertContactData,
  dbConnect,
  getDBdetailsData,
  getDBloginData,
  checkEmailExists,
  updateDbHub,
  updateDbCollectionParcel,
  deleteDbHub,
  getDBHubdetailsData,
  getDBCollectionParceldetailsData,
  updateDbCollection,
  deleteDbCollection,
  getDBCollectiondetailsData,
 } = require('./db.js');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const app = express();


const myschema = fs.readFileSync('./graphqlSchema', 'utf-8');

async function addUser(_, { user }) {
  console.log("..............addUser....");
  user.id = await getNextSequence('customer_details');
  console.log("..............addUser...."+user.id);
  user.isDeleted = 1;
  await insertDbUser(user);
  return user;
}

async function addHub(_, { hub }) {
  console.log("..............addHub....");
  hub.id = await getHubNextSequence('hub_details');
  console.log("..............addHub...."+hub.id);
  hub.isDeleted = 1;
  hub.isActive = 1;
  await insertHub(hub);
  return hub;
}

async function addContactData(_, { contactData }) {
  console.log("..............contactData....");
  contactData.id = await getHubNextSequence('hub_details');
  console.log("..............contactData...."+contactData.id);
  await insertContactData(contactData);
  return contactData;
}

async function addCollectionParcel(_, { collectionParcel }) {
  console.log(".............addcollectionParcel....");
  collectionParcel.id = await getCollectionParcelNextSequence('parcel_details');
  console.log("..............addcollectionParcel...."+collectionParcel.id);
  await insertCollectionParcel(collectionParcel);
  return collectionParcel;
}


async function addCollection(_, { collection }) {
  console.log("..............addCollection....");
  collection.id = await getCenterNextSequence('center_details');
  console.log("..............addCollection...."+collection.id);
  collection.isDeleted = 1;
  collection.isActive = 1;
  await insertCenter(collection);
  return collection;
}

async function getUser() {
  console.log("getuser");
  return await getDbUser();
}
async function getHubDetails() {
  console.log("getHubDetails");
  return await getDbHubDetails();
}
async function getCollectionParcelDetails() {
  console.log("getcollectionParcelDetails");
  return await getDbCollectionParcelDetails();
}

async function getCollectionDetails() {
  console.log("getCollectionDetails");
  return await getDbCollectionDetails();
}

async function detailsData(id) {
  console.log('detailsData...' + id);
  return await getDBdetailsData(id);
}

async function loginData(Email,Password) {
  console.log('loginData...' + Email,Password);
  return await getDBloginData(Email,Password);
}
async function checkEmailData(Email) {
  console.log('checkEmailData...' + Email);
  return await checkEmailExists(Email);
}
async function hubUpdate(_, { hub }) {
  console.log('Received hub:', hub);
  try {
    const { id, ...changes } = hub;
    const updatedHub = await updateDbHub(id, changes);
    return updatedHub;
  } catch (error) {
    console.error('Error updating hub:', error);
    throw error;
  }
}
async function collectionParcelUpdate(_, { collectionParcel }) {
  console.log('Received collectionParcel:', collectionParcel);
  try {
    const { id, ...changes } = collectionParcel;
    const updatedCollectionParcel = await updateDbCollectionParcel(id, changes);
    return updatedCollectionParcel;
  } catch (error) {
    console.error('Error updating collectionParcel:', error);
    throw error;
  }
}

async function collectionUpdate(_, { collection }) {
  console.log('Received colletion:', collection);
  try {
    const { id, ...changes } = collection;
    const updatedColletion = await updateDbCollection(id, changes);
    return updatedColletion;
  } catch (error) {
    console.error('Error updating colletion:', error);
    throw error;
  }
}
async function hubDelete(_, { hub }) {
  console.log('Received hub:', hub);
  try {
    const { id, ...changes } = hub;
    const updatedhub = await deleteDbHub(id, changes);
    return updatedhub;
  } catch (error) {
    console.error('Error updating hub:', error);
    throw error;
  }
}
async function collectionDelete(_, { collection }) {
  console.log('Received collection:', collection);
  try {
    const { id, ...changes } = collection;
    const updatedcollection = await deleteDbCollection(id, changes);
    return updatedcollection;
  } catch (error) {
    console.error('Error updating collection:', error);
    throw error;
  }
}
async function detailsData(id) {
  console.log('detailsData...' + id);
  return await getDBHubdetailsData(id);
}
async function detailsCollectionParcelData(id) {
  console.log('detailsData...' + id);
  return await getDBCollectionParceldetailsData(id);
}
async function detailsCollectionData(id) {
  console.log('detailsCollectionData...' + id);
  return await getDBCollectiondetailsData(id);
}
=======
async function loginData(Email,Password) {
  console.log('loginData...' + Email,Password);
  return await getDBloginData(Email,Password);
}


const resolvers = {
  Query: {
    userList: getUser,
    hubList: getHubDetails,
    collectionParcelList: getCollectionParcelDetails,
    collectionList: getCollectionDetails,
    detailsList: (parent, { id }) => detailsData(id),

login: (_, { Email,Password }) => loginData(Email,Password),


    checkEmail: (_, { Email }) => checkEmailData(Email),
    hubdetailsList: (parent, { id }) => detailsData(id),
    collectionParceldetailsList: (parent, { id }) => detailsCollectionParcelData(id),
    collectiondetailsList: (parent, { id }) => detailsCollectionData(id),
  },

  Mutation: {
    addUser,
    addHub,
    addContactData,
    addCollectionParcel,
    addCollection,
    hubUpdate,
    collectionParcelUpdate,
    collectionUpdate,
    hubDelete,
    collectionDelete,
     },
};
const myPort = process.env.API_PORT;
const server = new ApolloServer({ typeDefs: myschema, resolvers });
server.start().then((res) => {
  server.applyMiddleware({ app, path: '/graphql' });
  dbConnect();
  app.listen(myPort, () => console.log('server started at port 8000'));
});
