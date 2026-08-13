const express = require('express')
const validationMiddlweare = require('../middlewares/validation.middleware')
const cartController = require('../controllers/cart.controller')
const {createAuthMiddlewere}  = require('../middlewares/auth.controller') 

const routes = express.Router()

routes.post('/',validationMiddlweare.validationaddItemTOCart,createAuthMiddlewere(['user']),cartController.addItemToCarts)  

routes.patch('/items/:productId',validationMiddlweare.validateUpdateCartItem,createAuthMiddlewere(['user']),cartController.updateItemQuantity)

routes.get('/',createAuthMiddlewere(['user']),cartController.getCart)

routes.delete(
  "/items/:productId",
  createAuthMiddlewere(["user"]),
  cartController.removeCartItem
);

module.exports = routes 