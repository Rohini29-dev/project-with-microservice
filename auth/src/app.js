const cookieParser = require('cookie-parser')
const express = require('express')
const authRoutes = require('../src/routes/auth.routes')
const cors = require('cors')
const passport  =require('passport')





const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(cookieParser())
app.use(passport.initialize());




app.get('/',(req,res)=>{
    res.status(200).json({
       message: 'Auth service is running'
    })
})


app.use('/api/auth',authRoutes)



module.exports = app