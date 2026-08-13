const cookieParser = require('cookie-parser')
const express = require('express')
const paymentsRoutes = require('../src/routes/paymnet.routes')
const app = express()


app.use(express.json())
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.status(200).json({
       message: 'payments service is running'
    })
})
 

app.use('/api/payments',paymentsRoutes)



module.exports = app