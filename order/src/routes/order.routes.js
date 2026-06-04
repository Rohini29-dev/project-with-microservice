const express = require('express')
const orderController = require('../controllers/order.controller')
const orderValidation = require('../middlewares/validation.middleware')
const {createAuthMiddleware} = require('../middlewares/auth.middleware')
const { validationResult } = require('express-validator')

const routes = express.Router()



routes.post('/',createAuthMiddleware(['user']),orderValidation.createAddressValidation,orderController.createOrder)

routes.get('/me',createAuthMiddleware(['user']),orderController.getOrder)

routes.post('/:id/cancel',createAuthMiddleware(['user']),orderController.cancelOrderById)

routes.patch('/:id/address',createAuthMiddleware(['user']),orderValidation.updateAddressValidation,orderController.updateOrderAddress)

routes.get('/:id',createAuthMiddleware(['user']),orderController.getByOrderId)


module.exports = routes