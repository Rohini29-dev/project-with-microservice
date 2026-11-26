const request = require("supertest");
const app = require("../src/app");
const jwt = require("jsonwebtoken");

jest.mock("../src/models/order.models");

const orderModel = require("../src/models/order.models");

process.env.JWT_SECRET = "testsecret";

function generateToken(role = "user") {
  return jwt.sign(
    { id: "user123", role },
    process.env.JWT_SECRET
  );
}

describe("PATCH /api/orders/:id/address", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ✅ SUCCESS CASE
  it("should update order address successfully", async () => {

    const token = generateToken();

    const mockOrder = {
      _id: "order1",
      user: "user123",
      status: "PENDING",
      shippingAddress: {},
      save: jest.fn().mockResolvedValue(true)
    };

    orderModel.findById.mockResolvedValue(mockOrder);

    const res = await request(app)
      .patch("/api/orders/order1/address")
      .set("Authorization", `Bearer ${token}`)
      .send({
        shippingAddress: {
          street: "new street",
          city: "ujjain",
          state: "mp",
          pincode: "456010",
          country: "India"
        }
      });

    expect(res.statusCode).toBe(200);
    expect(mockOrder.shippingAddress.street).toBe("new street");
  });


  // ❌ ORDER NOT FOUND
  it("should return 404 if order not found", async () => {

    const token = generateToken();

    orderModel.findById.mockResolvedValue(null);

    const res = await request(app)
      .patch("/api/orders/order1/address")
      .set("Authorization", `Bearer ${token}`)
      .send({
        shippingAddress: {
          street: "abc",
          city: "ujjain",
          state: "mp",
          pincode: "456010",
          country: "India"
        }
      });

    expect(res.statusCode).toBe(404);
  });


  // ❌ FORBIDDEN USER
  it("should return 403 if user is not owner", async () => {

    const token = generateToken();

    const mockOrder = {
      _id: "order1",
      user: "otherUser",
      status: "PENDING",
      save: jest.fn()
    };

    orderModel.findById.mockResolvedValue(mockOrder);

    const res = await request(app)
      .patch("/api/orders/order1/address")
      .set("Authorization", `Bearer ${token}`)
      .send({
        shippingAddress: {
          street: "abc",
          city: "ujjain",
          state: "mp",
          pincode: "456010",
          country: "India"
        }
      });

    expect(res.statusCode).toBe(403);
  });


  // ❌ STATUS NOT PENDING
  it("should return 409 if order is not pending", async () => {

    const token = generateToken();

    const mockOrder = {
      _id: "order1",
      user: "user123",
      status: "SHIPPED",
      save: jest.fn()
    };

    orderModel.findById.mockResolvedValue(mockOrder);

    const res = await request(app)
      .patch("/api/orders/order1/address")
      .set("Authorization", `Bearer ${token}`)
      .send({
        shippingAddress: {
          street: "abc",
          city: "ujjain",
          state: "mp",
          pincode: "456010",
          country: "India"
        }
      });

    expect(res.statusCode).toBe(409);
  });


  // ❌ NO TOKEN
  it("should fail without token", async () => {

    const res = await request(app)
      .patch("/api/orders/order1/address");

    expect(res.statusCode).toBe(401);
  });


  // ❌ VALIDATION ERROR
  it("should return 400 for invalid address", async () => {

    const token = generateToken();

    const res = await request(app)
      .patch("/api/orders/order1/address")
      .set("Authorization", `Bearer ${token}`)
      .send({
        shippingAddress: {
          street: "", // invalid
          city: "",
          state: "",
          pincode: "",
          country: ""
        }
      });

    expect(res.statusCode).toBe(400);
  });

});