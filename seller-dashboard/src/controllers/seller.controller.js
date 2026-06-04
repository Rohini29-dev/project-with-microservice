const userModel = require('../models/user.model');
const productModel = require('../models/product.model');
const orderModel = require('../models/order.models');
const paymentModel = require('../models/payment.model');

async function getMetrics(req, res) {
    try {

        const seller = req.user;

        const products = await productModel.find({
            seller: seller.id || seller._id
        });

        const productIds = products.map(p => p._id);

        const orders = await orderModel.find({
            "items.product": { $in: productIds },
            status: {
                $in: [
                    "CONFIRMED",
                    "SHIPPED",
                    "DELIVERED",
                    "CANCELLED"
                ]
            }
        });

        let sales = 0;
        let revenue = 0;

        const productSales = {};

        orders.forEach(order => {

            order.items.forEach(item => {

                if (
                    productIds.some(id => id.equals(item.product))
                ) {

                    sales += item.quantity;

                    revenue +=
                        item.price.amount * item.quantity;

                    const productId =
                        item.product.toString();

                    productSales[productId] =
                        (productSales[productId] || 0) +
                        item.quantity;
                }
            });

        });

        const topProducts = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([productId, qty]) => {

                const prod = products.find(p =>
                    p._id.toString() === productId
                );

                return prod
                    ? {
                        id: prod._id,
                        title: prod.title,
                        sold: qty
                    }
                    : null;

            })
            .filter(Boolean);

        return res.json({
            sales,
            revenue,
            totalProducts: products.length,
            topProducts
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        });

    }
}

async function getOrder(req, res) {
    try {

        const seller = req.user;

        const products = await productModel.find({
            seller: seller.id || seller._id
        });

        const productIds = products.map(p => p._id);

        const orders = await orderModel.find({
            "items.product": {
                $in: productIds
            }
        })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        const filteredOrders = orders
            .map(order => {

                const filteredItems = order.items.filter(
                    item =>
                        productIds.some(id =>
                            id.equals(item.product)
                        )
                );

                return {
                    ...order.toObject(),
                    items: filteredItems
                };

            })
            .filter(order => order.items.length > 0);

        return res.json(filteredOrders);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        });

    }
}

async function getProducts(req, res) {
    try {

        const seller = req.user;

        const products = await productModel.find({
            seller: seller.id || seller._id
        });

        return res.json(products);

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
    getProducts
};


 

