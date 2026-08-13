require("dotenv").config();


const app = require("./src/app");
const connectToDb = require("./src/db/db");
const { connect } = require("./src/borker/borker");
const startConsumer = require("./src/borker/consumer");

async function startServer() {
  try {
    await connectToDb();

    await connect();

    await startConsumer();

    app.listen(3003, () => {
      console.log("Order service running on port 3003");
    });

  } catch (error) {
    console.log(error);
  }
}

startServer();