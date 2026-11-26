const mongoose = require('mongoose')


const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    isdefault: {
        type: Boolean,
        default: false
    }
})


const orderSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    items:[{
        productId:{
            type:String,
            required:true
        },
        quantity:{
            type:String,
            default:1,
            min:1
        }
    }],

    price:{
        amount:{

            type:Number,
            required:true
        },
        currency:{
            type:String,
            enum:['INR','USD'],
            default:'INR'
        }
    },
    status:{
        type:String,
        enum:['PENDING','CONFIRMED','CANCELLED','SHIPPED','DELIVERED'],
    },
    totalPrice:{
        amount:{
            type:Number,
        },
        currency:{
            type:String,
        }
    },
  shippingAddress:{
    type:addressSchema,
    required:true
  }

},
// {timestamps:true}
{
    timeline: {
  type: [
    {
      type: { type: String },
      at: { type: Date, default: Date.now }
    }
  ],
  default: [] 
}
}
)

const orderModel = mongoose.model('order',orderSchema)


module.exports = orderModel