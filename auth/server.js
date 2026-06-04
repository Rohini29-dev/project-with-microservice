require("dotenv").config()
const app = require("./src/app");
const connectToDb = require("./src/db/db");
const {connect} = require('./src/borker/borker')




connectToDb()
connect()

app.listen(3000,()=>{
    console.log('Auth server is running on port 3000');
    
})