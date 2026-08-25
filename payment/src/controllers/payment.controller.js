const { default: axios } = require("axios")
const paymentModel = require('../models/payment.model')

require('dotenv').config();
const Razorpay = require('razorpay');
const { publishToQueue } = require("../broker/borker.js");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


 
 async function createPaymnet(req,res) {
const token  = req.cookies?.token || req.headers?.authorization?.split(' ')[
    1
]

    try {
        const orderId = req.params.orderId

const orderResponse = await axios.get('http://localhost:3003/api/orders/'+ orderId,{
    headers:{
        Authorization:`Bearer ${token}`
    }
})

// console.log(  "orderResponse----->", orderResponse.data..order.price);

const price = orderResponse.data.order.price

    // const order = await razorpay.orders.create(price);

    const order = await razorpay.orders.create({
    amount: price.amount,
    currency: price.currency,
    receipt: `receipt_${Date.now()}`
});

    // console.log("order------->",order);
    

    const payment = await paymentModel.create({
        order:orderId,
        razorpayOrderId:order.id,
        user:req.user.id,
        price:{
            amount: order.amount,
            currency:order.currency
        },
        status:'PENDING'
        
    })

       await publishToQueue('PAYMENT_SELLER_DASHBOARD.PAYMENT_CREATED', payment)

       await publishToQueue('PAYMENT_NOTIFICATION.PAYMENT_INITIATED',{
        email:req.user.email,
        orderId:orderId,
        amount:price.amount/100,
        currency:price.currency,
        username:req.user.username
       })

return res.status(201).json({
            message:'Payment initiated',
            payment,
             razorpay: {
        key: process.env.RAZORPAY_KEY_ID,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency
    }

})

    } catch (error) {
        console.log('error------>',error);
        
        return res.status(500).json({message : 'Internal server Error'})
    }
    
 }

async function verifyPayment(req, res) {


    const {
        razorpayOrderId,
        paymentId,
        signature
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    try {

        const { validatePaymentVerification } =
            require('razorpay/dist/utils/razorpay-utils');

        const isValid = validatePaymentVerification(
            {
                order_id: razorpayOrderId,
                payment_id: paymentId,
            },
            signature,
            secret
        );

        console.log("isValid => ", isValid);

        if (!isValid) {
            return res.status(400).json({
                message: 'Invalid signature'
            });
        }

        const payment = await paymentModel.findOne({
            razorpayOrderId: razorpayOrderId,
            status: 'PENDING'
        });

        if (!payment) {
            return res.status(404).json({
                message: 'Payment not found'
            });
        }

        payment.paymentId = paymentId;
        payment.signature = signature;
        payment.status = 'COMPLETED';

        await payment.save();


        // await publishToQueue("PAYMENT_NOTIFICATION.PAYMENT_COMPLETE",
        //     {
        //         email:req.user.email,
        //         orderId:payment.order,
        //         paymentId:payment.paymentId,
        //         amount:payment.price.amount/100,
        //         currency:payment.price.currency,
        //         fullName:req.user.fullName

        //     }
        // )


        await Promise.all([

  publishToQueue(
    "PAYMENT_NOTIFICATION.PAYMENT_COMPLETE",
    {
      email: req.user.email,
      orderId: payment.order,
      paymentId: payment.paymentId,
      amount: payment.price.amount / 100,
      currency: payment.price.currency,
      fullName: req.user.fullName,
    }
  ),

  publishToQueue(
    "PAYMENT_SELLER_DASHBOARD.PAYMENT_UPDATE",
    payment
  ),

  publishToQueue(
    "PAYMENT_ORDER.PAYMENT_COMPLETED",
    {
      orderId: payment.order,
      paymentId: payment.paymentId,
    }
  )

]);


        // await Promise.all([

            
        //     publishToQueue("PAYMENT_NOTIFICATION.PAYMENT_COMPLETE",
        //         {
        //             email:req.user.email,
        //             orderId:payment.order,
        //             paymentId:payment.paymentId,
        //             amount:payment.price.amount/100,
        //             currency:payment.price.currency,
        //             fullName:req.user.fullName
                    
        //         }
        //     ),

        //                 publishToQueue('PAYMENT_SELLER_DASHBOARD.PAYMENT_UPDATE', payment)

        // ])
        return res.status(200).json({
            message: 'Payment verified successfully',
            payment
        });

    } catch (error) {

        console.log(error);
        await publishToQueue("PAYMENT_NOTIFICATION.PAYMENT_FAILED",
            {
                email:req.user.email,
                orderId:razorpayOrderId,
                paymentId:payment.paymentId,
                
            }
        )

        return res.status(500).json({
            message: 'Error verifying payment'
        });
    }
}

 module.exports = {
    createPaymnet,
    verifyPayment
 }