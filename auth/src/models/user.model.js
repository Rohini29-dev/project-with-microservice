const mongoose  = require('mongoose')

const addressSchmea = new mongoose.Schema({
    street:String,
    city:String,
    state:String,
    zip:String,
    country:String,
    isDefult:{
        type:Boolean,
        default:false
    }
})


const userSchema  = new mongoose.Schema({
username:{
    type:String,
    required:true,
    unique:true
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    select:true
},
fullName:{
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    }
},
role:{
    type:String,
    enum:['user','seller'],
    default:'user'
},
addresses:[addressSchmea]
})


const userModel = mongoose.model('user',userSchema)



module.exports = userModel