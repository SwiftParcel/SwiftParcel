require('dotenv').config({ path: './env.env' });
const { MongoClient } = require('mongodb');
let db;
const dbUrl = process.env.dbUrl;

async function dbConnect() {
  const dbclient = new MongoClient(
    'mongodb+srv://swiftparcel95:Swiftparcel%40group7@cluster0.tb7afq8.mongodb.net/SswiftParcel',
    { useNewUrlParser: true }
  );
  db = (await dbclient.connect()).db();

  console.log('connected to databse');
  return db;
}
async function getNextSequence(field) {
  const result = await db
    .collection('counters')
    .findOneAndUpdate(
      { name: field },
      { $inc: { counter: 1 } },
      { returnOriginal: false, upsert: true }
    );
  return result.counter;
}
async function getHubNextSequence(field) {
  const result = await db
    .collection('hub_counters')
    .findOneAndUpdate(
      { name: field },
      { $inc: { counter: 1 } },
      { returnOriginal: false, upsert: true }
    );
  return result.counter;
}
async function getCollectionParcelNextSequence(field) {
  const result = await db
    .collection('parcel_counters')
    .findOneAndUpdate(
      { name: field },
      { $inc: { counter: 1 } },
      { returnOriginal: false, upsert: true }
    );
  return result.counter;
}
async function getCenterNextSequence(field) {
  const result = await db
    .collection('center_counters')
    .findOneAndUpdate(
      { name: field },
      { $inc: { counter: 1 } },
      { returnOriginal: false, upsert: true }
    );
  return result.counter;
}
async function getDbUser() {
  const query = { isDeleted: 1 };
  const customerlist = await db.collection('customer_details').find(query).toArray();
  return customerlist;
}
async function getDbHubDetails() {
  const query = { isDeleted: 1 };
  const hublist = await db.collection('hub_details').find(query).toArray();
  console.log("hublist......"+hublist);
  return hublist;
}
async function getCollectionRequestDetailsDBForUpdate(id) {
  const filter = {};
  console.log('in getCollectionRequestDetailsDBForUpdate' + id); 
  const collection = await db.collection('collection_request_details').find({ id }).toArray();
  console.log('in collection....' + collection[0].id);
  return collection;
}
async function getUserRequestDetails() {
  const query = { isDeleted: 1,RequestStatus:"In Progress"};
  const user = await db.collection('collection_request_details').find(query).toArray();
  return user;
}
//update collection center  data
async function collectionDbRequestUpdate(id, changes) {
  console.log('in update collection', id);
  console.log('in update collection changes', changes);
  
  if (
    
    changes.RequestStatus 
    
  ) {
    const collection = await db.collection('collection_request_details').findOne({ id });
    Object.assign(collection, changes);
    // validate(issue);
  }
  await db.collection('collection_request_details').updateOne({ id }, { $set: changes });
  const savedcollection = await db.collection('collection_request_details').findOne({ id });
  return savedcollection;
}
async function getDbCollectionParcelDetails() {
  const collectionParcellist = await db.collection('parcel_details').find().toArray();
  console.log("CollectionParcellist......"+collectionParcellist);
  return collectionParcellist;
}
async function getDbCollectionDetails() {
  const query = { isDeleted: 1 };
  const collectionlist = await db.collection('center_details').find(query).toArray();
  console.log("collectionlist......"+collectionlist);
  return collectionlist;
}
async function insertDbUser(user) {
  try {
    // Insert into 'login' collection
    const loginInsertResult = await db.collection('login').insertOne({
      username: user.username,
      password: user.password,
      user_type: 'User',
      isDeleted: 1,
    });
    console.log("Login data stored:", loginInsertResult);

    const loginId = loginInsertResult.insertedId;

    // Insert into 'customer_details' collection
    const customerInsertResult = await db.collection('customer_details').insertOne({
      cust_ID: await getNextSequence('customer_details'),
      Cust_name: user.Cust_name,
      cust_contact: user.cust_contact,
      cust_email: user.cust_email,
      log_id: loginId,
    });
    console.log("Customer data stored:", customerInsertResult);

    if (customerInsertResult.acknowledged) {
      return {
        cust_ID: customerInsertResult.insertedId.toString(),
        Cust_name: user.Cust_name,
        cust_contact: user.cust_contact,
        cust_email: user.cust_email,
        log_id: loginId,
      };
    } else {
      throw new Error('Failed to insert user');
    }
  } catch (error) {
    console.error('Error adding user:', error);
    throw error; // Ensure errors are propagated for proper handling
  }
}

async function insertHub(hub) {
  await db.collection('hub_details').insertOne(hub);
}
async function insertContactData(contactData) {
  await db.collection('user_messages').insertOne(contactData);
}
async function insertCollectionParcel(collectionParcel) {
  console.log("inside insertCollectionParcel");
  await db.collection('parcel_details').insertOne(collectionParcel);
}

async function insertRoute(parcelRoute) {
  console.log("inside insertRoute");
  await db.collection('route_details').insertOne(parcelRoute);
}

//tracking

async function getRouteDetailsByTrackingID(trackingID) {
  // Example implementation
  console.log("trackingID in getRouteDetailsByTrackingID: "+trackingID);
  const routeDetails = await db.collection('route_details').findOne({ trackingID });
  return routeDetails;
}
async function insertCenter(center) {
  await db.collection('center_details').insertOne(center);
}
async function insertCollectionRequest(request) {
  request.RequestStatus="In Progress";
  await db.collection('collection_request_details').insertOne(request);
}

async function getDBdetailsData(id) {
  const user = await db.collection('customer_details').findOne({ cust_ID: id });
  return user;
}
async function getDBHubdetailsData(id) {
  const filter = {};
  console.log('in getDBHubdetailsData' + id); 
  const hub = await db.collection('hub_details').find({ id }).toArray();
  console.log('in hub....' + hub[0].id);
  return hub;
}
async function getDBCollectionParceldetailsData(id) {
  const filter = {};
  console.log('in getDBCollectionParceldetailsData' + id); 
  const collectionParcel = await db.collection('parcel_details').find({ id }).toArray();
  console.log('in CollectionParcel....' + collectionParcel[0].id);
  return collectionParcel;
}

async function getDBCollectiondetailsData(id) {
  const filter = {};
  console.log('in getDBCollectiondetailsData' + id); 
  const collection = await db.collection('center_details').find({ id }).toArray();
  console.log('in collection....' + collection[0].id);
  return collection;
}
async function getDBloginData(Email, Password) {
  console.log("inside getDBloginData");
  const user = await db.collection('login').findOne({ username: Email, password: Password });
  if (user) {
    return {
      login_Id: user._id.toString(),
      username: user.username,
      password: user.password,
      user_type: user.user_type,
      isDeleted: user.isDeleted,
    };
  } else {
    return null;
  }
}

async function getloginData(Email) {
  const user = await db.collection('login').findOne({ username: Email });
  return user;
}

async function updatePassword(email, newPassword) {
  const result = await db.collection('login').updateOne(
    { username: email },
    { $set: { password: newPassword } }
  );
  return result.modifiedCount > 0;
}
async function checkEmailExists(Email) {
  const user = await db.collection('customer_details').findOne({ cust_email: Email });
  return user;
}

async function checkEmailExistsEmp(Email) {
  const user = await db.collection('employee_details').findOne({ emp_email: Email });
  return user;
}
async function requestdetails(loginId) {
  const user = await db.collection('collection_request_details').find({ log_id: loginId }).toArray();;
  return user;
}
async function getEmployeeDetails(Id) {
  const BSON = require('bson');
  const nid = new BSON.ObjectId(Id)
  console.log("........nid..."+nid);
  const user = await db.collection('employee_details').findOne({ log_id: nid });
  return user;
}


async function getUserByEmailAndPassword(email, password) {
  const user = await db.collection('login').findOne({ username: email, password: password, isDeleted: 1 });
  console.log("inside getUserByEmailAndPassword");
  return user;
}

//update hub data
async function updateDbHub(id, changes) {
  console.log('in update hub', id);
  console.log('in update hub changes', changes);
  
  if (
    changes.Name ||
    changes.StreetNo ||
    changes.City ||
    changes.State ||
    changes.Country ||
    changes.PostalCode ||
    changes.isActive 
    
  ) {
    const hub = await db.collection('hub_details').findOne({ id });
    Object.assign(hub, changes);
    // validate(issue);
  }
  await db.collection('hub_details').updateOne({ id }, { $set: changes });
  const savedhub = await db.collection('hub_details').findOne({ id });
  return savedhub;
}

//update DbCollectionParcel data
async function updateDbCollectionParcel(id, changes) {
  console.log('in update DbCollectionParcel', id);
  console.log('in update DbCollectionParcel changes', changes);
  
  if (
    changes.ParcelHeight ||
    changes.ParcelLength ||
    changes.ParcelWidth ||
    changes.ParcelWeight ||
    changes.ParcelOrigin ||
    changes.ParcelDestination ||
    changes.ParcelSenderName ||
    changes.ParcelCurrentLocation 
    
  ) {
    const hub = await db.collection('parcel_details').findOne({ id });
    Object.assign(hub, changes);
    // validate(issue);
  }
  await db.collection('parcel_details').updateOne({ id }, { $set: changes });
  const savedcollectionparcel = await db.collection('parcel_details').findOne({ id });
  return savedcollectionparcel;
}

//update collection center  data
async function updateDbCollection(id, changes) {
  console.log('in update collection', id);
  console.log('in update collection changes', changes);
  
  if (
    changes.Name ||
    changes.StreetNo ||
    changes.City ||
    changes.State ||
    changes.Country ||
    changes.PostalCode ||
    changes.isActive 
    
  ) {
    const collection = await db.collection('center_details').findOne({ id });
    Object.assign(collection, changes);
    // validate(issue);
  }
  await db.collection('center_details').updateOne({ id }, { $set: changes });
  const savedcollection = await db.collection('center_details').findOne({ id });
  return savedcollection;
}

async function deleteDbHub(id, changes) {
  const hubDetals = await db.collection('hub_details').find({ id }).toArray();
  console.log('in userDetals....' + hubDetals[0].currentStatus);
  console.log('in update issue 1222', id);
  console.log('in update issue changes', changes);
  //   const db = getDb();
  if(hubDetals[0]!== 'undefined' && hubDetals[0].isActive===1){
    return null;
  }
  else{
    changes = {};
  changes.isDeleted = 0;

  const hub = await db.collection('hub_details').findOne({ id });
  console.log("hub.."+hub);
  Object.assign(hub, changes);

 

  await db.collection('hub_details').updateOne({ id }, { $set: changes });
  const savedhub = await db.collection('hub_details').findOne({ id });
  console.log(' savedhub...' + savedhub);
  return savedhub;
  }
  
}
async function deleteDbCollection(id, changes) {
  const collectionDetals = await db.collection('center_details').find({ id }).toArray();
  console.log('in userDetals....' + collectionDetals[0].currentStatus);
  console.log('in update issue 1222', id);
  console.log('in update issue changes', changes);
  //   const db = getDb();
  if(collectionDetals[0]!== 'undefined' && collectionDetals[0].isActive===1){
    return null;
  }
  else{
    changes = {};
  changes.isDeleted = 0;

  const collection = await db.collection('center_details').findOne({ id });
  console.log("collection.."+collection);
  Object.assign(collection, changes);

 

  await db.collection('center_details').updateOne({ id }, { $set: changes });
  const savedcollection = await db.collection('center_details').findOne({ id });
  console.log(' savedcollection...' + savedcollection);
  return savedcollection;
  }
  
}

//Employee
async function insertDbEmployee(employee) {
  try {
    // Insert into 'login' collection
    const loginInsertResult = await db.collection('login').insertOne({
      username: employee.username,
      password: employee.password,
      user_type: 'Employee',
      isDeleted: 1,
    });

    const loginId = loginInsertResult.insertedId;

    // Insert into 'employee_details' collection
    const employeeInsertResult = await db.collection('employee_details').insertOne({
      emp_ID: await getNextSequence('employee_details'),
      Emp_name: employee.Emp_name,
      emp_role: employee.emp_role,
      emp_location: employee.emp_location,
      emp_contact: employee.emp_contact,
      emp_email: employee.emp_email,
      shift: employee.shift,
      log_id: loginId,
    });

    if (employeeInsertResult.acknowledged) {
      return {
        emp_ID: employeeInsertResult.insertedId.toString(),
        Emp_name: employee.Emp_name,
        emp_role: employee.emp_role,
        emp_location: employee.emp_location,
        emp_contact: employee.emp_contact,
        emp_email: employee.emp_email,
        shift: employee.shift,
        log_id: loginId,
      };
    } else {
      throw new Error('Failed to insert employee');
    }
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error; 
  }
}

module.exports = {
  getNextSequence,
  getHubNextSequence,
  getCollectionParcelNextSequence,
  getCenterNextSequence,
  insertDbUser,
  insertHub,
  insertContactData,
  insertCollectionParcel,
  insertCenter,
  insertCollectionRequest,
  getDbUser,
  getDbHubDetails,
  getDbCollectionParcelDetails,
  getDbCollectionDetails,
  dbConnect,
  getDBdetailsData,
  getDBloginData,
  getUserByEmailAndPassword,
  checkEmailExists,
  checkEmailExistsEmp,
  requestdetails,
  getEmployeeDetails,
  insertDbEmployee,
  getloginData,
  updatePassword,
  updateDbHub,
  updateDbCollectionParcel,
  updateDbCollection,
  deleteDbHub,
  deleteDbCollection,
  getDBHubdetailsData,
  getDBCollectionParceldetailsData,
  getDBCollectiondetailsData,
  insertRoute,
  getUserRequestDetails,
  collectionDbRequestUpdate,
  getCollectionRequestDetailsDBForUpdate,
  getRouteDetailsByTrackingID,
};