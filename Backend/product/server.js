require("dotenv").config()
const app = require("./src/app");
const connectToDb = require("./src/db/db");
const {connect} = require("./src/borker/borker")




connectToDb()
connect()

app.listen(3001,()=>{
    console.log('products server is running on port 3001');
    
})