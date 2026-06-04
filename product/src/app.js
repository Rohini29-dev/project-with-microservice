const cookieParser = require('cookie-parser')
const express = require('express')
const productRoutes = require('../src/routes/product.routes')

const app = express()
app.use(express.json())
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.status(200).json({
       message: 'product service is running'
    })
})


app.use('/api/products',productRoutes)


module.exports = app