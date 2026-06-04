const mongoose = require('mongoose')
const dns = require('dns')

dns.setServers(['8.8.8.8','8.8.4.4'])

 async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Database connection successfully ✔');
    } catch (error) {
        console.log('Database connection failed ❌',error);
        
    }
}


module.exports = connectToDb