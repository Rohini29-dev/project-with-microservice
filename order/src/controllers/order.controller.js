const { default: axios } = require("axios");
const orderModel = require("../models/order.models");
const {publishToQueue} = require('../borker/borker')

// async function createOrder(req, res) {
//     const user = req.user;
//     const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

//     try {
//         // 1. Get cart
//         const cartResponse = await axios.get('http://localhost:3002/api/carts/', {
//             headers: { Authorization: `Bearer ${token}` }
//         });

//         console.log('cartResponse---->',cartResponse);
        

//         const cartItems = cartResponse.data.cart.items;

//         // 2. Get product details
//         const products = await Promise.all(
//             cartItems.map(async (item) => {
//                 const res = await axios.get(`http://localhost:3001/api/products/${item.productId}`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 return res.data.data;
//             })
//         );

//         let priceAmount = 0;

//         // 3. Create order items
//         const orderItems = cartItems.map((item) => {
//             const product = products.find(p => p.id == item.productId);

//             if (!product || product.instock < item.quantity) { 
//                 throw new Error(`Product ${product?.name} out of stock`);
//             }

//             const itemTotal = product.price.amount * item.quantity;

//             priceAmount += itemTotal;

//             return {
//                 product: item.productId,
//                 quantity: item.quantity,
//                 price: {
//                     amount: itemTotal,
//                     currency: product.price.currency
//                 }
//             };
//         });

//         // 4. Create order
//         const order = await orderModel.create({
//             user: user.id,
//             items: orderItems,
//             status: 'PENDING',
//             totalPrice: {
//                 amount: priceAmount,
//                 currency: 'INR'
//             },
//             shippingAddress: req.body.shippingAddress
//         });

//         return res.status(201).json({
//             message: 'Order created successfully',
//             order
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: error.message
//         });
//     }
// }



async function createOrder(req, res) {

  const user = req.user;

  const token =
    req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  try {
    // 1. Get cart
    const cartResponse = await axios.get(
      "http://localhost:3002/api/carts/",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const cartItems = cartResponse.data.cart.items;

    // 2. Get all products
  const products = await Promise.all(
  cartItems.map(async (item) => {
    const productRes = await axios.get(
      `http://localhost:3001/api/products/${item.productId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return productRes.data.data;
    
  })
);

console.log("products --->", products);

let priceAmount = 0

const orderItems = cartItems.map((item) => {

  const product = products.find(
    (p) => p._id.toString() === item.productId
  );

  if (!product || product.stock < item.quantity) {
    throw new Error(`Product ${product?.title} out of stock`);
  }

  const itemTotal = product.price.amount * item.quantity;
  priceAmount += itemTotal;

  return {
    productId: item.productId, // ✅ FIXED
    quantity: item.quantity,
    price: {
      amount: itemTotal,
      currency: product.price.currency
    }
  };

});



const order = await orderModel.create({
  user: user.id,
  items: orderItems,
  status: "PENDING",
  price: {                   // ✅ ADD THIS
    amount: priceAmount,
    currency: "INR"
  },
  shippingAddress: req.body.shippingAddress
});

await publishToQueue("ORDER_SELLER_DASHBOARD.ORDER_CREATED",order)

    res.status(201).json({
  message: "Order created",
  order
});

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message
    });
  }
  
  
  
}

async function getOrder(req,res) {
  const user = req.user
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)|| 10
  
  const skip = (page-1)*limit
  
  try {
   const orders = await orderModel.find({ user: user.id });

const totalOrders = await orderModel.countDocuments({ user: user.id });

res.status(200).json({
  orders,
  meta: {
    total: totalOrders,
    page,
    limit
  }
});

    } catch (error) {
        return res.status(500).json({
      message:'Inteval error'
    }) 
    }
}

async function cancelOrderById(req, res) {
  const user = req.user;
  const orderId = req.params.id;

  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "order not found"
      });
    }

    if (order.user.toString() !== user.id) {
      return res.status(403).json({
        message: "Not allowed to cancel this order"
      });
    }

    order.status = "CANCELLED";

    // ✅ FIX
    if (!order.timeline) {
      order.timeline = [];
    }

    order.timeline.push({
      type: "CANCELLED",
      at: new Date()
    });

    await order.save();

    return res.status(200).json({ order });

  } catch (error) {
    console.log("err-------> ", error);

    return res.status(500).json({
      message: "internal server error"
    });
  }
}

async function updateOrderAddress(req,res) {
  const user = req.user 
  const orderId = req.params.id
  try {
    const order = await orderModel.findById(orderId)

if(!order){
  return res.status(404).json({
    message:"order not found"
  })
}

if(order.user.toString() !== user.id){
  return res.status(403).json({
    message:'Forbidden:'
  })
}

if(order.status !== 'PENDING'){
  return res.status(409).json({
    message:'cannot update'
  })
}



 order.shippingAddress = req.body.shippingAddress

await order.save()



res.status(200).json({order})

  } catch (error) {
     return res.status(500).json({
      message: 'internal server error'
    });
  }
}

async function getByOrderId(req, res) {
  const user = req.user;
  const orderId = req.params.id;

  try {
    const order = await orderModel.findById(orderId);
    console.log("Before Response");
console.log(order.shippingAddress);





    if (!order) {
      return res.status(404).json({
        message: "order not found"
      });
    }

    if (order.user.toString() !== user.id) {
      return res.status(403).json({
        message: "Forbidden: You do not have access"
      });
    }

    // ✅ SUCCESS CASE
    return res.status(200).json({
      order
    });

  } catch (error) {
  console.log(error);

  return res.status(500).json({
    message: error.message
  });
}
}

module.exports = {
    createOrder,
    getOrder,
    cancelOrderById,
    updateOrderAddress,
    getByOrderId
}