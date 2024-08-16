const fs = require('fs');
const axios = require('axios');
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
  getDbRoutesDetails,
  getDbCollectionDetails,
  insertHub,
  insertCollectionParcel,
  insertParcelHistory,
  insertRoute,
  insertCenter,
  insertCollectionRequest,
  insertContactData,
  dbConnect,
  getDBdetailsData,
  getRouteDetailsByTrackingID,
  getDBloginData,
  checkEmailExists,
  updateDbHub,
  updateDbCollectionParcel,
  deleteDbHub,
  getDBHubdetailsData,
  getDBCollectionParceldetailsData,
  getDBdetailsHistoryData,
  getDBdetailsRouteData,
  updateDbCollection,
  deleteDbCollection,
  getDBCollectiondetailsData,
  checkEmailExistsEmp,
  requestdetails,
  getEmployeeDetails,
  insertDbEmployee,
  getloginData,
  updatePassword,
  getUserRequestDetails,
  collectionDbRequestUpdate,
  getCollectionRequestDetailsDBForUpdate,
  updateRouteInDb,
  getHistoryByTrackingID,
  parcelHistory,
  routeDetails,
 } = require('./db.js');
const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');

const cors = require('cors'); 
const nodemailer = require('nodemailer');
const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use(cors());

const myschema = fs.readFileSync('./graphqlSchema', 'utf-8');

const { sendResetPasswordEmail, sendResetPasswordSMS } = require('./emailSMS.js');

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

async function addCollection(_, { collection }) {
  console.log("..............addCollection....");
  collection.id = await getCenterNextSequence('center_details');
  console.log("..............addCollection...."+collection.id);
  collection.isDeleted = 1;
  collection.isActive = 1;
  await insertCenter(collection);
  return collection;
}

async function addCollectionRequest(_, { collectionRequest }) {
  console.log("..............collectionRequest....");
  collectionRequest.id = await getCenterNextSequence('center_details');
  console.log("..............addCollection...."+collectionRequest.id);
  collectionRequest.isDeleted = 1;
  collectionRequest.isActive = 1;
  await insertCollectionRequest(collectionRequest);
  return collectionRequest;
}
async function addParcelHistory(_, { parcelHistory }) {
  console.log("..............collectionRequest....");
  parcelHistory.id = await getCollectionParcelNextSequence('parcel_details');
  console.log("..............addCollection...."+parcelHistory.id);
  await insertParcelHistory(parcelHistory);
  return parcelHistory;
}

async function getUser() {
  console.log("getuser");
  return await getDbUser();
}
async function getRoutesDetails(){
  console.log("getRoutesDetails");
  return await getDbRoutesDetails();
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
async function updateRoute(_, { newRoute }) {
  try {
    console.log("updateRoute main"+newRoute)
    const { trackingID, ...changes } = newRoute;
    // Assuming you have a function in db.js to update the route details
    const updatedRoute = await updateRouteInDb(trackingID, changes);
    
    return updatedRoute;
  } catch (error) {
    console.error('Error updating route:', error);
    throw new Error('Failed to update route');
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
    //getAffectedRoutes(id);
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
async function detailsHistoryData(id) {
  console.log('detailsHistoryData...' + id);
  return await getDBdetailsHistoryData(id);
}
async function detailsRouteData(id) {
  console.log('detailsRouteData...' + id);
  return await getDBdetailsRouteData(id);
}


async function collectionRequestUpdate(_, { collection }) {
  console.log('Received colletion:', collection);
  try {
    const { id, ...changes } = collection;
    const updatedColletion = await collectionDbRequestUpdate(id, changes);
    return updatedColletion;
  } catch (error) {
    console.error('Error updating colletion:', error);
    throw error;
  }
}
async function getCollectionRequestDetailsForUpdate(id) {
  console.log('detailsCollectionData...' + id);
  return await getCollectionRequestDetailsDBForUpdate(id);
}
async function detailsCollectionData(id) {
  console.log('detailsCollectionData...' + id);
  return await getDBCollectiondetailsData(id);
}

const resolvers = {
  Query: {
    userList: getUser,
    hubList: getHubDetails,
    // routeDetails: async (_, { trackingID }) => {
    //   try {
    //     const route = await getRouteDetailsByTrackingID(trackingID);
    //     console.log('Route from resolver:', route); // Debugging
    //     return route;
    //   } catch (error) {
    //     console.error('Error fetching route details:', error);
    //     throw new Error('Failed to fetch route details');
    //   }
    // },
    collectionParcelList: getCollectionParcelDetails,
    routes: getRoutesDetails,
    getUserRequestDetails:getUserRequestDetails,
    collectionList: getCollectionDetails,
    detailsList: (_, { id }) => getDBdetailsData(id),
    login: async (_, { Email, Password }) => {
      try {
        const loginData = await getDBloginData(Email, Password);
        return loginData;
      } catch (error) {
        console.error('Error during login:', error);
        throw new Error('Login failed');
      }
    },
    getUserDetails: async (_, { Id }) => {
      const BSON = require('bson');
      const nid = new BSON.ObjectId(Id);
      const user = await db.collection('customer_details').findOne({ log_id: nid });
      return user;
    },
    checkEmail: (_, { Email }) => checkEmailExists(Email),
    checkEmailEmp: (_, { Email }) => checkEmailExistsEmp(Email),
    requestdetails: (parent, { loginId }) => requestdetails(loginId),
    getEmployeeDetails: (_, { Id }) => getEmployeeDetails(Id),
    parcelHistory: (parent, { ParceltrackingID }) => detailsHistoryData(ParceltrackingID),
    routeDetails: (parent, { trackingID }) => detailsRouteData(trackingID),
    hubdetailsList: (parent, { id }) => detailsData(id),
    collectionParceldetailsList: (parent, { id }) => detailsCollectionParcelData(id),
    collectiondetailsList: (parent, { id }) => detailsCollectionData(id),
    getCollectionRequestDetailsForUpdate: (parent, { id }) => getCollectionRequestDetailsForUpdate(id),
    // parcelHistory: async (_, { ParceltrackingID }) => {
    //   try {
        
    //     console.log('id from resolver:', ParceltrackingID); // Debugging
    //     const history = await getHistoryByTrackingID(ParceltrackingID);
    //     console.log('history from main:', history); 
    //     return history;
    //   } catch (error) {
    //     console.error('Error fetching history details:', error);
    //     throw new Error('Failed to fetch history details');
    //   }
    // },
 
  },

  Mutation: {
    addUser,
    addHub,
    addContactData,
    //addCollectionParcel,
    addCollection,
    addCollectionRequest,
    addParcelHistory,
    collectionRequestUpdate,
    hubUpdate,
    collectionParcelUpdate,
    collectionUpdate,
    hubDelete,
    collectionDelete,
    updateRoute,
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
    addParcel: async (_, { parcel, route }) => {
      try {
        // Insert parcel into Parcel table
        parcel.id = await getCollectionParcelNextSequence('parcel_details');
        await insertCollectionParcel(parcel);

        // Insert route into Route table
        //route.parcelId = parcel.id;
        await insertRoute(route);
        console.log("new parcel is: "+parcel);
        console.log("new route is: "+route);
        // Return the inserted parcel
        return parcel;
      } catch (error) {
        console.error('Error adding parcel:', error);
        throw new Error('Failed to add parcel');
      }
    },
    
    updateUser: async (_, { Id, Cust_name, cust_contact, cust_email }) => {
      const BSON = require('bson');
      const nid = new BSON.ObjectId(Id);

      const updateData = {};
      if (Cust_name !== undefined) updateData.Cust_name = Cust_name;
      if (cust_contact !== undefined) updateData.cust_contact = cust_contact;
      if (cust_email !== undefined) updateData.cust_email = cust_email;

      await db.collection('customer_details').updateOne({ log_id: nid }, { $set: updateData });

      const updatedUser = await db.collection('customer_details').findOne({ log_id: nid });
      return updatedUser;
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

app.get('/api/directions', async (req, res) => {
  const { origin, destination, waypoints, key } = req.query;

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin,
        destination,
        waypoints,
        key,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching directions:', error);
    res.status(500).send('Failed to fetch directions');
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

// Initialize Apollo Server
const server = new ApolloServer({ typeDefs: gql(myschema), resolvers });

// Start Apollo Server and integrate with Express app
server.start().then(() => {
  server.applyMiddleware({ app, path: '/graphql' });

  // Connect to database and start Express server
  dbConnect().then((database) => {
    // Assign db to global variable for access throughout the application
    global.db = database;

    app.listen({ port: PORT }, () =>
      console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`)
    );
  });
});

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
