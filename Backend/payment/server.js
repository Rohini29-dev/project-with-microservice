require('dotenv').config()
const app = require("./src/app");
const { connect } = require('./src/broker/borker');
const connectToDb = require("./src/db/db");



connectToDb()
connect()
app.listen(3004,()=>{
console.log('Payment server running on port 3004');

})