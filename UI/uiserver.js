require('dotenv').config({ path:'env.env' });
const express = require('express');
const path = require( 'path' ); 
const app = express();
app.use(express.static('public'));

const myAppPort = process.env.UI_PORT;
app.listen(myAppPort,  ()=> {
console.log(`App started on port ${myAppPort}`);
});

app.get('/',(req,res)=>{
    res.sendFile(path.resolve(__dirname, 'index.html'))
});