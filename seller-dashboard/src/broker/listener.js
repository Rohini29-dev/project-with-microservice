const { subscribeToQueue } = require("./broker");

const userModel = require("../models/user.model");
const productModel = require("../models/product.model");
const orderModel = require("../models/order.models");
const paymentModel = require("../models/payment.model");

module.exports = async function () {

  subscribeToQueue(
    "AUTH_SELLER.USER_CREATED",
    async (data) => {

      try {
        console.log("data------->", data);

        await userModel.create(data);

        console.log(
          `User created in seller dashboard: ${data.username}`
        );

      } catch (error) {

        if (error.code === 11000) {
          console.log(
            `User already exists: ${data.email}`
          );
          return;
        }

        throw error;
      }
    }
  );


  subscribeToQueue(
    "PRODUCT_SELLER_DASHBOARD.PRODUCT_CREATED",
    async (product) => {

      console.log("Received Product:", product);

      await productModel.create(product);
    }
  );


  subscribeToQueue(
    "ORDER_SELLER_DASHBOARD.ORDER_CREATED",
    async (order) => {

      await orderModel.create(order);
    }
  );


  subscribeToQueue(
    "PAYMENT_SELLER_DASHBOARD.PAYMENT_CREATED",
    async (payment) => {

      await paymentModel.create(payment);
    }
  );


  subscribeToQueue(
    "PAYMENT_SELLER_DASHBOARD.PAYMENT_UPDATE",
    async (payment) => {

      await paymentModel.findOneAndUpdate(
        { orderId: payment.orderId },
        payment,
        { new: true }
      );
    }
  );
};