const { subscribeToQueue } = require("./broker");

const userModel = require("../models/user.model");
const productModel = require("../models/product.model");
const orderModel = require("../models/order.models");
const paymentModel = require("../models/payment.model");

module.exports = async function () {

  // =====================================================
  // USER CREATED
  // =====================================================

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


  // =====================================================
  // PRODUCT CREATED
  // =====================================================

  subscribeToQueue(
    "PRODUCT_SELLER_DASHBOARD.PRODUCT_CREATED",
    async (product) => {

      try {
        console.log("Received Product:", product);

        await productModel.create(product);

      } catch (error) {
        console.error(
          "PRODUCT CREATED ERROR =>",
          error
        );

        throw error;
      }
    }
  );


  // =====================================================
  // ORDER CREATED
  // =====================================================

  subscribeToQueue(
    "ORDER_SELLER_DASHBOARD.ORDER_CREATED",
    async (order) => {

      try {
        await orderModel.create(order);

      } catch (error) {
        console.error(
          "ORDER CREATED ERROR =>",
          error
        );

        throw error;
      }
    }
  );


  // =====================================================
  // PAYMENT CREATED
  // =====================================================

  subscribeToQueue(
    "PAYMENT_SELLER_DASHBOARD.PAYMENT_CREATED",
    async (payment) => {

      try {
        await paymentModel.create(payment);

      } catch (error) {
        console.error(
          "PAYMENT CREATED ERROR =>",
          error
        );

        throw error;
      }
    }
  );


  // =====================================================
  // PAYMENT UPDATE
  // =====================================================

  subscribeToQueue(
  "PAYMENT_SELLER_DASHBOARD.PAYMENT_UPDATE",
  async (payment) => {

    try {

      console.log(
        "Payment update received:",
        payment
      );

      const { _id, ...paymentUpdate } = payment;

      const updatedPayment =
        await paymentModel.findOneAndUpdate(
          {
            order: payment.order
          },
          {
            $set: paymentUpdate
          },
          {
            new: true
          }
        );

      if (!updatedPayment) {

        console.log(
          `Payment not found for order: ${payment.order}`
        );

        return;
      }

      console.log(
        "Payment successfully updated:",
        updatedPayment
      );

    } catch (error) {

      console.error(
        "PAYMENT UPDATE ERROR =>",
        error
      );

      throw error;
    }
  }
);
};
