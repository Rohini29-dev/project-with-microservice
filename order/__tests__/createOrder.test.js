process.env.JWT_SECRET = "testsecret";
const request = require("supertest");
const app = require("../src/app");
const jwt = require("jsonwebtoken");
jest.mock("../src/borker/borker", () => ({
  publishToQueue: jest.fn().mockResolvedValue(true),
}));
jest.mock("axios");
jest.mock("../src/models/order.models");

jest.mock("../src/borker/borker", () => ({
  publishToQueue: jest.fn().mockResolvedValue(true),
}));

const axios = require("axios");
const orderModel = require("../src/models/order.models");

function generateToken(role = "user") {
  return jwt.sign(
    { id: "user123", role },
    process.env.JWT_SECRET
  );
}

describe("POST /api/orders", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("✅ should create order successfully", async () => {

    const token = generateToken();

    // mock cart
   axios.get.mockImplementation((url) => {

  if (url.includes("carts")) {
    return Promise.resolve({
      data: {
        cart: {
          items: [{ productId: "p1", quantity: 2 }]
        }
      }
    });
  }

  if (url.includes("products")) {
    return Promise.resolve({
      data: {
        data: {
  _id: "p1",
  title: "Product 1",
  stock: 10,
  price: {
    amount: 100,
    currency: "INR"
  }
}
      }
    });
  }

});
    orderModel.create.mockResolvedValue({
      _id: "order123"
    });

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
     .send({
  user: "user123",
  items: [{ productId: "p1", quantity: 2 }],
  price: { amount: 200 },
 shippingAddress: {
  fullName: "Rohini Test",
  phone: "9876543210",
  street: "abc",
  city: "ujjain",
  state: "mp",
  pincode: "456010",
  country: "India"
}
});

    expect(res.statusCode).toBe(201);
  });

  it("❌ should fail without token", async () => {

    const res = await request(app)
      .post("/api/orders")
      .send({});

    expect(res.statusCode).toBe(401);
  });

  it("❌ should fail validation", async () => {

    const token = generateToken();

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({}); // invalid body

    expect(res.statusCode).toBe(400);
  });

});