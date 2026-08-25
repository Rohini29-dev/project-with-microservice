const userModel = require("../models/user.model");
const productModel = require("../models/product.model");
const orderModel = require("../models/order.models");
const paymentModel = require("../models/payment.model");

async function getMetrics(req, res) {
  try {
    const seller = req.user;

    const products = await productModel.find({
      seller: seller.id || seller._id,
    });

    const productIds = products.map((p) => p._id.toString());

    // const orders = await orderModel.find({
    //   "items.productId": { $in: productIds },
    //   status: {
    //     $in: ["CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
    //   },
    // });

    const orders = await orderModel.find({
  "items.productId": { $in: productIds },
});

console.log("SELLER PRODUCT IDS =>", productIds);
console.log("METRIC ORDERS =>", orders);

    let sales = 0;
    let revenue = 0;

    const productSales = {};

    orders.forEach((order) => {
      // Order level revenue
      revenue += order.price?.amount || 0;

      order.items.forEach((item) => {
        if (
          productIds.some(
            (id) => id.toString() === item.productId.toString()
          )
        ) {
          sales += Number(item.quantity);

          const productId = item.productId.toString();

          productSales[productId] =
            (productSales[productId] || 0) +
            Number(item.quantity);
        }
      });
    });

    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([productId, qty]) => {
        const prod = products.find(
          (p) => p._id.toString() === productId
        );

        return prod
          ? {
              id: prod._id,
              title: prod.title,
              sold: qty,
            }
          : null;
      })
      .filter(Boolean);

    return res.json({
      sales,
      revenue,
      orders: orders.length,
      products: products.length,
      topProducts,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// async function getOrder(req, res) {
//   try {
//     const seller = req.user;

//     const products = await productModel.find({
//       seller: seller.id || seller._id,
//     });

//     const productIds = products.map((p) => p._id.toString());

//     const orders = await orderModel.find({
//       "items.productId": {
//         $in: productIds,
//       },
//     });

//     const filteredOrders = orders
//       .map((order) => {
//         const filteredItems = order.items.filter((item) =>
//           productIds.some(
//             (id) => id.toString() === item.productId.toString()
//           )
//         );

//         return {
//           ...order.toObject(),
//           items: filteredItems,
//         };
//       })
//       .filter((order) => order.items.length > 0);

//     return res.json(filteredOrders);
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// }


async function getOrder(req, res) {
  try {
    const seller = req.user;

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Seller products
    const products = await productModel.find({
      seller: seller.id || seller._id,
    });

    const productIds = products.map((p) => p._id.toString());

    // All seller orders
    const orders = await orderModel.find({
      "items.productId": {
        $in: productIds,
      },
    });

    // Seller items only
    const filteredOrders = orders
      .map((order) => {
        const filteredItems = order.items.filter((item) =>
          productIds.includes(item.productId.toString())
        );

        return {
          ...order.toObject(),
          items: filteredItems,
        };
      })
      .filter((order) => order.items.length > 0);

    // Pagination
    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / limit);

    const paginatedOrders = filteredOrders.slice(
      skip,
      skip + limit
    );

    return res.json({
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        totalOrders,
        totalPages,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getProducts(req, res) {
  try {
    const seller = req.user;

    const products = await productModel.find({
      seller: seller.id || seller._id,
    });

    return res.json(products);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getSingleOrder(req, res) { 
  try {

    const seller = req.user;
    const orderId = req.params.id;

    // Seller ke saare products
    const products = await productModel.find({
      seller: seller.id || seller._id 
    });

    const productIds = products.map(product =>
      product._id.toString()
    );

    // Order
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    // Seller ke products hi filter karo
    const sellerItems = order.items.filter(item =>
      productIds.includes(item.productId.toString())
    );

    if (sellerItems.length === 0) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    // Products details attach karo
    const items = sellerItems.map(item => {

      const product = products.find(
        p => p._id.toString() === item.productId.toString()
      );

      return {
        productId: item.productId,
        quantity: item.quantity,
        product
      };

    });

    return res.json({

      _id: order._id,

      status: order.status,

      price: order.price,

      shippingAddress: order.shippingAddress,

      user: order.user,

      items

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Internal server error"
    });

  }
}

async function updateOrderStatus(req, res) {
  try {

    const seller = req.user;
    const orderId = req.params.id;
    const { status } = req.body;

    const allowedStatus = [
      "PENDING",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED"
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    // Seller ke products
    const products = await productModel.find({
      seller: seller.id || seller._id
    });

    const productIds = products.map(product =>
      product._id.toString()
    );

    // Order
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    // Check seller owns at least one product in order
    const hasSellerProduct = order.items.some(item =>
      productIds.includes(item.productId.toString())
    );

    if (!hasSellerProduct) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    // Update Status
    order.status = status;

    // Timeline (optional)
    if (!order.timeline) {
      order.timeline = [];
    }

    order.timeline.push({
      type: status,
      at: new Date()
    });

    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      order
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Internal server error"
    });

  }
}

module.exports = {
  getMetrics,
  getOrder,
  getProducts,
  getSingleOrder,
  updateOrderStatus
};