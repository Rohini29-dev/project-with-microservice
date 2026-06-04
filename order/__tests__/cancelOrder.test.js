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

describe("POST /api/orders/:id/cancel", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ✅ SUCCESS CASE
  it("should cancel order successfully", async () => {

    const token = generateToken();

    const mockOrder = {
      _id: "order1",
      user: "user123",
      status: "PENDING",
      timeline: [],
      save: jest.fn().mockResolvedValue(true)
    };

    orderModel.findById.mockResolvedValue(mockOrder);

    const res = await request(app)
      .post("/api/orders/order1/cancel")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(mockOrder.status).toBe("CANCELLED");
  });


  // ❌ ORDER NOT FOUND
  it("should return 404 if order not found", async () => {

    const token = generateToken();

    orderModel.findById.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/orders/order1/cancel")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });


  // ❌ UNAUTHORIZED USER
  it("should return 403 if user not owner", async () => {

    const token = generateToken();

    const mockOrder = {
      _id: "order1",
      user: "otherUser",
      timeline: [],
      save: jest.fn()
    };

    orderModel.findById.mockResolvedValue(mockOrder);

    const res = await request(app)
      .post("/api/orders/order1/cancel")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });


  // ❌ NO TOKEN
  it("should fail without token", async () => {

    const res = await request(app)
      .post("/api/orders/order1/cancel");

    expect(res.statusCode).toBe(401);
  });

});