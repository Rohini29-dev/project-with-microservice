require('dotenv').config()
const app = require("./src/app");
const connectToDb = require('./src/db/db');
const {connect } = require('./src/borker/borker')
connectToDb()
connect()

app.listen(3003,()=>{
    console.log('order service running on port 3003');
    
})