const express = require("express");

const validationMiddleware = require("../middlewares/validation.middleware");
const cartController = require("../controllers/cart.controller");
const {
  createAuthMiddlewere,
} = require("../middlewares/auth.controller");

const routes = express.Router();

// Add item to cart
routes.post(
  "/",
  validationMiddleware.validationaddItemTOCart,
  createAuthMiddlewere(["user"]),
  cartController.addItemToCarts
);

// Update cart item quantity
routes.patch(
  "/items/:productId",
  validationMiddleware.validateUpdateCartItem,
  createAuthMiddlewere(["user"]),
  cartController.updateItemQuantity
);

// Get cart
routes.get(
  "/",
  createAuthMiddlewere(["user"]),
  cartController.getCart
);

// Remove item
routes.delete(
  "/items/:productId",
  createAuthMiddlewere(["user"]),
  cartController.removeCartItem
);

module.exports = routes;