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
  checkEmailExistsEmp,
  insertDbEmployee,
  getloginData,
  updatePassword,
 } = require('./db.js');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const app = express();
const cors = require('cors'); 
const nodemailer = require('nodemailer');
app.use(express.json());
app.use(cors());


const myschema = fs.readFileSync('./graphqlSchema', 'utf-8');

async function addUser(_, { user }) {
  try {
    user.log_id = await getNextSequence('customer_details');
    const insertedUser = await insertDbUser(user);
    if (!insertedUser || !insertedUser.cust_ID) {
      throw new Error('Failed to insert user or cust_ID is missing');
    }
    return insertedUser;
  } catch (error) {
    console.error('Error adding user:', error);
    throw new Error('Failed to add user');
  }
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
    login: async (_, { Email, Password }) => {
      try {
        const loginData = await getDBloginData(Email, Password);
        return loginData;
      } catch (error) {
        console.error('Error during login:', error);
        throw new Error('Login failed');
      }
    },
    checkEmail: (_, { Email }) => checkEmailExists(Email),
    checkEmailEmp: (_, { Email }) => checkEmailExistsEmp(Email),
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
    addEmployee: async (_, { employee }) => {
      try {
        employee.log_id = await getNextSequence('employee_details');
        console.log("............Emplye loc"+employee.emp_location)
        const insertedEmployee = await insertDbEmployee(employee);
        if (!insertedEmployee || !insertedEmployee.emp_ID) {
          throw new Error('Failed to insert employee or emp_ID is missing');
        }
        return insertedEmployee;
      } catch (error) {
        console.error('Error adding employee:', error);
        throw new Error('Failed to add employee');
      }
    },
  },
};

// Handle password reset request
app.post('/api/request-password-reset', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await getloginData(email);

    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist.' });
    }

    let userDetails;
    if (user.user_type === 'User') {
      userDetails = await db.collection('customer_details').findOne({ log_id: user._id });
    } else if (user.user_type === 'Employee') {
      userDetails = await db.collection('employee_details').findOne({ log_id: user._id });
    } else {
      return res.status(400).json({ message: 'Invalid user type.' });
    }

    if (!userDetails) {
      return res.status(404).json({ message: 'User details not found.' });
    }

    const newPassword = Math.random().toString(36).slice(-8);
    await updatePassword(email, newPassword);

    await sendResetPasswordEmail(email, newPassword);
    await sendResetPasswordSMS(userDetails.cust_contact || userDetails.emp_contact, newPassword);

    res.status(200).json({ message: 'Password reset instructions sent to your email and phone.' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint for fetching locations (hubs and centers)
app.get('/api/locations', async (req, res) => {
  try {
    const hubs = await getDbHubDetails();
    const centers = await getDbCollectionDetails();
    res.json({ hubs, centers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

const myPort = process.env.API_PORT;
const server = new ApolloServer({ typeDefs: myschema, resolvers });
// Start Apollo Server and integrate with Express app
server.start().then(() => {
  server.applyMiddleware({ app, path: '/graphql' });

  // Connect to database and start Express server
  dbConnect().then((database) => {
    // Assign db to global variable for access throughout the application
    global.db = database;

    app.listen({ port: process.env.API_PORT || 8000 }, () =>
      console.log(`Server running at http://localhost:${process.env.API_PORT || 8000}${server.graphqlPath}`)
    );
  });
});

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

