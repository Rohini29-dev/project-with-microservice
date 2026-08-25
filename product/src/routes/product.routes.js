const express = require('express')
const productController = require('../controllers/product.controller')
const {createAuthMiddleware}  = require('../middlewares/auth.middleware')
const multer  = require('multer')

const routes = express.Router()

const upload = multer({storage:multer.memoryStorage()})

routes.post('/',createAuthMiddleware(['admin','seller']),upload.array('images',5),productController.createProduct)

routes.get('/',productController.getProduct)
routes.get('/seller',createAuthMiddleware(['seller']),productController.getProductbyseller)

routes.get('/:id',productController.getProductById)

routes.patch("/:id",createAuthMiddleware(['seller']),productController.updateProduct)
routes.delete('/:id',createAuthMiddleware(['seller']),productController.deleteProduct)




module.exports= routes