const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = require("../src/app");
const cartModel = require("../src/models/cart.model");

process.env.JWT_SECRET = "testsecret";

// helper
function generateToken(role = "user") {
  return jwt.sign(
    { id: new mongoose.Types.ObjectId(), role },
    process.env.JWT_SECRET
  );
}

describe("Get Cart API", () => {

  // ✅ should return existing cart
  it("should return cart with items", async () => {
    const token = generateToken();
    const userId = jwt.decode(token).id;

    await cartModel.create({
      user: userId,
      items: [
        { productId: new mongoose.Types.ObjectId(), quantity: 2 },
        { productId: new mongoose.Types.ObjectId(), quantity: 3 }
      ]
    });

    const res = await request(app)
      .get("/api/carts")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.itemCounts).toBe(2);
    expect(res.body.totalQuantity).toBe(5);
  });

  // ✅ should create cart if not exists
  it("should create cart if not exists", async () => {
    const token = generateToken();

    const res = await request(app)
      .get("/api/carts")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.cart).toBeDefined();
    expect(res.body.itemCounts).toBe(0);
    expect(res.body.totalQuantity).toBe(0);
  });

  // ❌ unauthorized
  it("should return 401 if token not provided", async () => {
    const res = await request(app)
      .get("/api/carts");

    expect(res.statusCode).toBe(401);
  });

  // ❌ forbidden
  it("should return 403 if role not allowed", async () => {
    const token = generateToken("admin");

    const res = await request(app)
      .get("/api/carts")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

});