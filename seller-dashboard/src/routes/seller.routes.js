const express  = require('express')
const createAuthMiddlewere  = require("../middlewares/auth.middleware")
const controller = require("../controllers/seller.controller")
const routes = express.Router()

routes.get('/metrics',createAuthMiddlewere(['seller'],controller.getMetrics))

routes.get('/orders',createAuthMiddlewere(['seller'],controller.getOrder))

routes.get('/products',createAuthMiddlewere(['seller'],controller.getProducts))

module.exports = routes