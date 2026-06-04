const express = require('express')
const validateMiddlware = require('../middlewares/validation.middleware.js')
const authController = require('../controllers/auth.controllers.js')
const authMiddleware = require('../middlewares/auth.middleware.js')


const routes = express.Router()

routes.post('/register',validateMiddlware.registerUserValidation,authController.registerUserController)
routes.post('/login',validateMiddlware.loginUserValidation,authController.loginUserController),
routes.get('/me',authMiddleware.authMiddleware,authController.getCurrentUser)
routes.get('/logout',authController.logOutUser)

routes.get('/users/me/addresses',authMiddleware.authMiddleware,authController.getUserAddress)
routes.post('/users/me/addresses',validateMiddlware.createAddressValidation,authMiddleware.authMiddleware,authController.addUserAddress)
routes.delete('/users/me/addresses/:addressId',authMiddleware.authMiddleware,authController.deleteUserAddress)

module.exports = routes