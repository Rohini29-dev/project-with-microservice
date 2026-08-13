const express = require("express");
const createAuthMiddlewere = require("../middlewares/auth.middleware");
const controller = require("../controllers/seller.controller");

const routes = express.Router();

routes.get(
  "/metrics",
  createAuthMiddlewere(["seller"]),
  controller.getMetrics
);

routes.get(
  "/orders",
  createAuthMiddlewere(["seller"]),
  controller.getOrder
);

routes.get(
  "/products",
  createAuthMiddlewere(["seller"]),
  controller.getProducts
);

routes.get(
  "/orders/:id",
  createAuthMiddlewere(["seller"]),
  controller.getSingleOrder
);

routes.patch(
  "/orders/:id/status",
  createAuthMiddlewere(["seller"]),
  controller.updateOrderStatus
);


module.exports = routes;