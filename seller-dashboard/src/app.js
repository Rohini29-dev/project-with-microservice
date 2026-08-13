const cookieParser = require("cookie-parser")
const express = require("express")
const sellerRoute = require('./routes/seller.routes')
const app = express()


app.use(express.json())
app.use(cookieParser())
app.get("/api/test", (req, res) => {
  res.json({ message: "working" });
});

app.get('/',(req,res)=>{
res.status(200).json({message:"Seller Dashboard service is running"});
})


app.use('/api/seller/dashboard',sellerRoute)

module.exports = app