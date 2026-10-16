const cookieParser = require('cookie-parser')
const express = require('express')
const productRoutes = require('../src/routes/product.routes')
const cors = require('cors')



const app = express()
app.use(express.json())
app.use(cookieParser())




app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}))
app.get('/',(req,res)=>{
    res.status(200).json({
       message: 'product service is running'
    })
})


app.use('/api/products',productRoutes)


module.exports = app