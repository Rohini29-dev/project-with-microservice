const express = require('express')
const validateMiddlware = require('../middlewares/validation.middleware.js')
const authController = require('../controllers/auth.controllers.js')
const authMiddleware = require('../middlewares/auth.middleware.js')
const passport = require("passport");


const routes = express.Router()

routes.post('/register',validateMiddlware.registerUserValidation,authController.registerUserController)
routes.post('/login',validateMiddlware.loginUserValidation,authController.loginUserController),
routes.get('/me',authMiddleware.authMiddleware,authController.getCurrentUser)
routes.put(
  '/users/me',
  authMiddleware.authMiddleware,
  authController.updateCurrentUser
);

routes.put(
  '/users/me/password',
  authMiddleware.authMiddleware,
  authController.changePassword
);

routes.get('/logout',authController.logOutUser)

routes.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

routes.get('/google/callback',
  passport.authenticate('google', { session: false }),authController.googleAuthCallback);


routes.get('/users/me/addresses',authMiddleware.authMiddleware,authController.getUserAddress)
routes.post('/users/me/addresses',validateMiddlware.createAddressValidation,authMiddleware.authMiddleware,authController.addUserAddress)
routes.delete('/users/me/addresses/:addressId',authMiddleware.authMiddleware,authController.deleteUserAddress)

module.exports = routes