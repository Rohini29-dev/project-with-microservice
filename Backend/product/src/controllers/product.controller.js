const { default: mongoose } = require("mongoose");
const productModel = require("../models/product.model");
const { uploadFile } = require("../services/imagekit.service");
const {publishToQueue} = require('../borker/borker')

async function createProduct(req, res) {
  try {
    const {
      title,
      description,
      priceAmount,
      priceCurrency = "INR",
      stock,
    } = req.body;

    // ==============================
    // VALIDATION
    // ==============================

    if (!title || !priceAmount) {
      return res.status(400).json({
        message: "title, priceAmount and seller are required",
      });
    }

    if (stock === undefined || stock === "") {
      return res.status(400).json({
        message: "stock is required",
      });
    }

    const seller = req.user.id;

    // ==============================
    // VALIDATE NUMBERS
    // ==============================

    const amount = Number(priceAmount);
    const stockQuantity = Number(stock);

    if (Number.isNaN(amount) || amount < 0) {
      return res.status(400).json({
        message: "Invalid price",
      });
    }

    if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
      return res.status(400).json({
        message: "Invalid stock quantity",
      });
    }

    // ==============================
    // UPLOAD IMAGES
    // ==============================

    const images = [];

    if (req.files && req.files.length) {
      for (const file of req.files) {
        const result = await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        });

        images.push(result);
      }
    }

    // ==============================
    // CREATE PRODUCT
    // ==============================

    const product = await productModel.create({
      title,
      description,

      price: {
        amount,
        currency: priceCurrency,
      },

      seller,

      images,

      // ⭐ THIS WAS MISSING
      stock: stockQuantity,
    });

    // ==============================
    // PUBLISH EVENTS
    // ==============================

    await publishToQueue(
      "PRODUCT_SELLER_DASHBOARD.PRODUCT_CREATED",
      product
    );

    await publishToQueue(
      "PRODUCT_NOTIFICATION.PRODUCT_CREATED",
      {
        email: req.user.email,
        productId: product._id,
        sellerId: seller,
      }
    );

    // ==============================
    // RESPONSE
    // ==============================

    return res.status(201).json({
      message: "product created",
      product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR =>", error);

    return res.status(500).json({
      message: "Internal error",
      error: error.message,
    });
  }
}

async function getProduct(req, res) {
  try {
    const {
      q,
      miniprice,
      maxprice,
      skip = 0,
      limit = 6
    } = req.query;

    const filter = {};

    if (q) {
      filter.$text = { $search: q };
    }

    if (miniprice) {
      filter["price.amount"] = {
        ...filter["price.amount"],
        $gte: Number(miniprice)
      };
    }

    if (maxprice) {
      filter["price.amount"] = {
        ...filter["price.amount"],
        $lte: Number(maxprice)
      };
    }

    const products = await productModel
      .find(filter)
      .skip(Number(skip))
      .limit(Math.min(Number(limit), 20));

    const totalProducts = await productModel.countDocuments(filter);

    return res.status(200).json({
      data: products,
      totalProducts,
      hasMore: Number(skip) + products.length < totalProducts
    });

  } catch (error) {
    console.error("GET PRODUCTS ERROR =>", error);

    return res.status(500).json({
      message: "Internal error"
    });
  }
}

async function getProductById(req,res) {
    try {
        const {id} = req.params
        const product = await productModel.findById(id)

        if(!product){
            return res.status(404).json({
                message:'product not found'
            });
        }

        return res.status(200).json({
            data:product
        })
    } catch (error) {
      console.error('-------->',error);
      
        return res.status(500).json({
            message:'error fetching product',
            error:error.message
        })
    }
}


async function updateProduct(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid productId'
      });
    }

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "product not found"
      });
    }

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden: you can only update your own product"
      });
    }
    for (const key of Object.keys(req.body || {})) {

  if (key === "priceAmount") {
    product.price.amount = Number(req.body.priceAmount);
  }

  else if (key === "priceCurrency") {
    product.price.currency = req.body.priceCurrency;
  }

  else {
    product[key] = req.body[key];
  }
}
    await product.save();

    return res.status(200).json({
      message: "product update",
      product
    });

  } catch (error) {
    console.error('------------>',error);
    
    return res.status(500).json({
      message: 'error updating product',
      error: error.message
    });
  }
}


async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product id"
      });
    }

    const product = await productModel.findById(id); 

    if (!product) {
      return res.status(404).json({
        message: "product not found"
      });
    }

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Forbidden: you can only delete your own product'
      });
    }

    await productModel.findByIdAndDelete(id); 

    return res.status(200).json({
      message: "product deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: 'error deleting product',
      error: error.message
    });
  }
}  


async function getProductbyseller(req, res) {
  try {
    const seller = req.user;
    
    const { skip = 0, limit = 20 } = req.query;

    const product = await productModel
      .find({ seller: seller.id })
      .skip(Number(skip))
      .limit(Math.min(Number(limit), 20));

    return res.status(200).json({
      data: product
    });

  } catch (error) {
    return res.status(500).json({
      message: "error fetching seller products"
    });
  }
}




module.exports = {
    createProduct,
    getProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductbyseller

}