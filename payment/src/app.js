const cookieParser = require('cookie-parser')
const express = require('express')
const paymentsRoutes = require('../src/routes/paymnet.routes')
const cors = require('cors')
const app = express()

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.status(200).json({
       message: 'payments service is running'
    })
})
 

app.use('/api/payments',paymentsRoutes)



module.exports = app