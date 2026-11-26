const express = require('express')
const {createAuthMiddlewere} = require("../middlewares/auth.middleware")
const paymentController = require('../controllers/payment.controller')

const router = express.Router()

router.post('/create/:orderId',createAuthMiddlewere(['user']),paymentController.createPaymnet)

router.post('/verify',createAuthMiddlewere(['user']),paymentController.verifyPayment)



module.exports = router