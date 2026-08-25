const express = require('express')
const orderRoutes = require('../src/routes/order.routes')
const cookieParser = require("cookie-parser");

const cors = require("cors");
const app = express()

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);




app.use(express.json())
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.status(200).json({
       message: 'Order service is running'
    })
})


app.use('/api/orders',orderRoutes)


module.exports = app