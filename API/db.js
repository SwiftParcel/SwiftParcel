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

async function getDbUser() {
  const query = { isDeleted: 1 };
  const customerlist = await db.collection('customer_details').find(query).toArray();
  return customerlist;
}

async function insertDbUser(user) {
  await db.collection('customer_details').insertOne(user);
}

async function getDBdetailsData(id) {
  const user = await db.collection('customer_details').find({ id }).toArray();
  return user;
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


module.exports = {
  getNextSequence,
  insertDbUser,
  getDbUser,
  dbConnect,
  getDBdetailsData,
  getDBloginData,
  getUserByEmailAndPassword,
  checkEmailExists,
};