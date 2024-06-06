const fs = require('fs');
require('dotenv').config({ path: 'env.env' });
const {
  getNextSequence,
  insertDbUser,
  getDbUser,
  dbConnect,
  getDBdetailsData,
  getDBloginData,
  checkEmailExists,
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


async function getUser() {
  console.log("getuser");
  return await getDbUser();
}
async function detailsData(id) {
  console.log('detailsData...' + id);
  return await getDBdetailsData(id);
}

async function checkEmailData(Email) {
  console.log('checkEmailData...' + Email);
  return await checkEmailExists(Email);
}
const resolvers = {
  Query: {
    userList: getUser,
    detailsList: (parent, { id }) => detailsData(id),
    checkEmail: (_, { Email }) => checkEmailData(Email),
    
  },

  Mutation: {
    addUser,
     },
};
const myPort = process.env.API_PORT;
const server = new ApolloServer({ typeDefs: myschema, resolvers });
server.start().then((res) => {
  server.applyMiddleware({ app, path: '/graphql' });
  dbConnect();
  app.listen(myPort, () => console.log('server started at port 8000'));
});
