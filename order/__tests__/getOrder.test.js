process.env.JWT_SECRET = "testsecret";
const request = require("supertest");
const app = require("../src/app");
const jwt = require("jsonwebtoken");

jest.mock("../src/models/order.models");

const orderModel = require("../src/models/order.models");

function generateToken(role = "user") {
  return jwt.sign(
    { id: "user123", role },
    process.env.JWT_SECRET
  );
}

describe("GET /api/orders/me", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("✅ should fetch user orders", async () => {

    const token = generateToken();

    orderModel.find.mockResolvedValue([
      { _id: "order1" }
    ]);

    orderModel.countDocuments.mockResolvedValue(1);

    const res = await request(app)
      .get("/api/orders/me?page=1&limit=10")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.meta.total).toBe(1);
  });

  it("❌ should fail without token", async () => {

    const res = await request(app)
      .get("/api/orders/me");

    expect(res.statusCode).toBe(401);
  });

});