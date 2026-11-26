const express = require("express")
const {connect} = require('./borker/borker')
const setListeners=require('./borker/listners')

const app = express()

connect().then(()=>{
    setListeners()
})
app.get('/',(req,res)=>{
    res.status(200).json({
       message: 'notification service is running'
    })
})




module.exports = app