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
  await db.collection('customer_details').insertOne(user);
}
async function insertHub(hub) {
  await db.collection('hub_details').insertOne(hub);
}
async function insertContactData(contactData) {
  await db.collection('user_messages').insertOne(contactData);
}
async function insertCollectionParcel(collectionParcel) {
  await db.collection('parcel_details').insertOne(collectionParcel);
}

async function insertCenter(center) {
  await db.collection('center_details').insertOne(center);
}
async function getDBdetailsData(id) {
  const user = await db.collection('customer_details').find({ id }).toArray();
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
async function getDBloginData(Email,Password) {
  console.log(".........getDBloginData..."+Email);
  const user = await db.collection('customer_details').find({ Email: Email, Password: Password,  }).toArray();
  console.log(".........user..."+user);
  return user;
}
async function checkEmailExists(Email) {
  console.log(".........checkEmailExists..."+Email);
  const user = await db.collection('customer_details').find({ Email: Email, }).toArray();
  console.log(".........user..."+user);
  return user;
}

async function getUserByEmailAndPassword(email, password) {
  return await db.collection('customer_details').findOne({ Email: email, Password: password, isDeleted: 1 });
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
    changes.ParcelSenderName 
    
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
  getDbUser,
  getDbHubDetails,
  getDbCollectionParcelDetails,
  getDbCollectionDetails,
  dbConnect,
  getDBdetailsData,
  getDBloginData,
  getUserByEmailAndPassword,
  checkEmailExists,
  updateDbHub,
  updateDbCollectionParcel,
  updateDbCollection,
  deleteDbHub,
  deleteDbCollection,
  getDBHubdetailsData,
  getDBCollectionParceldetailsData,
  getDBCollectiondetailsData,
};