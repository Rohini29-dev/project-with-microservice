const cookieParser = require("cookie-parser")
const express = require("express")
const sellerRoute = require('./routes/seller.routes')
const app = express()
const cors = require('cors')




app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}))


app.get('/',(req,res)=>{
res.status(200).json({message:"Seller Dashboard service is running"});
})


app.use('/api/seller/dashboard',sellerRoute)

module.exports = app