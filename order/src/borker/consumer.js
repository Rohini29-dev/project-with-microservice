const { subscribeToQueue } = require("./borker.js");
const orderModel = require("../models/order.models.js");

async function startConsumer() {

  await subscribeToQueue(
    "PAYMENT_ORDER.PAYMENT_COMPLETED",
    async (data) => {

      console.log("Payment Completed Event:", data);

      const order = await orderModel.findById(data.orderId);

      if (!order) return;

      order.status = "CONFIRMED";

    if (!order.timeline) {
  order.timeline = [];
}

order.timeline.push({
  type: "PAYMENT_COMPLETED",
  at: new Date(),
});
      await order.save();

      console.log("Order confirmed");
    }
  );

}

module.exports = startConsumer;