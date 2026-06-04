const mongoose =require('mongoose')


const paymentSchema = new mongoose.Schema({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    paymentId:{
        type:String
    },
    razorpayOrderId:{
        type:String,
        required:true
    },
    signature:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId, required:true
    },
    price:{
        amount:{type:Number,require:true },
        currency:{
            type:String,
            require:true,  
        default:'INR', 
        enum:['INR','USD']}
    },
     status: {
    type: String,
    default: 'PENDING',
    enum:['PENDING', 'COMPLETED' ,'FAILED']
  },
    
},{timestamps:true})


const paymentModel = mongoose.model('payment',paymentSchema)


module.exports = paymentModel