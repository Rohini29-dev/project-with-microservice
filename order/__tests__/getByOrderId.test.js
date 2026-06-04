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

describe("GET /api/orders/:id", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ✅ SUCCESS
  it("should return order by id", async () => {

    const token = generateToken();

    const mockOrder = {
      _id: "order1",
      user: "user123"
    };

    orderModel.findById.mockResolvedValue(mockOrder);

    const res = await request(app)
      .get("/api/orders/order1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.order._id).toBe("order1");
  });

  // ❌ ORDER NOT FOUND
  it("should return 404 if order not found", async () => {

    const token = generateToken();

    orderModel.findById.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/orders/order1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  // ❌ FORBIDDEN
  it("should return 403 if user is not owner", async () => {

    const token = generateToken();

    const mockOrder = {
      _id: "order1",
      user: "otherUser"
    };

    orderModel.findById.mockResolvedValue(mockOrder);

    const res = await request(app)
      .get("/api/orders/order1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  // ❌ NO TOKEN
  it("should fail without token", async () => {

    const res = await request(app)
      .get("/api/orders/order1");

    expect(res.statusCode).toBe(401);
  });

});