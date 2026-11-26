process.env.JWT_SECRET = 'testsecret';
const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = require("../src/app"); // your express app
const cartModel = require("../src/models/cart.model");

// helper function to generate token
function generateToken(role = "user") {
  return jwt.sign(
    { id: new mongoose.Types.ObjectId(), role },
    process.env.JWT_SECRET
  );
}

describe("Add Item To Cart API", () => {

  // ✅ Success Case
  it("should add item to cart successfully", async () => {
    const token = generateToken();

    const res = await request(app)
      .post("/api/carts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId: new mongoose.Types.ObjectId().toString(),
        qty: 2,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("cart added successfully");
    expect(res.body.cart.items.length).toBe(1);
  });

  // ❌ Validation Error (missing productId)
  it("should return 400 if productId is missing", async () => {
    const token = generateToken();

    const res = await request(app)
      .post("/api/carts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        qty: 2,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  // ❌ Invalid productId
  it("should return 400 for invalid productId", async () => {
    const token = generateToken();

    const res = await request(app)
      .post("/api/carts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId: "123",
        qty: 2,
      });

    expect(res.statusCode).toBe(400);
  });

  // ❌ Unauthorized (no token)
  it("should return 401 if token not provided", async () => {
    const res = await request(app)
      .post("/api/carts")
      .send({
        productId: new mongoose.Types.ObjectId().toString(),
        qty: 2,
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Unauthorized: no token");
  });

  // ❌ Forbidden (wrong role)
  it("should return 403 if role is not allowed", async () => {
    const token = generateToken("admin");

    const res = await request(app)
      .post("/api/carts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId: new mongoose.Types.ObjectId().toString(),
        qty: 2,
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Forbidden: Insufficient permission");
  });

  // ✅ Existing item → quantity increase
  it("should increase quantity if item already exists", async () => {
    const token = generateToken();

    const productId = new mongoose.Types.ObjectId().toString();

    // first request
    await request(app)
      .post("/api/carts")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId, qty: 2 });

    // second request
    const res = await request(app)
      .post("/api/carts")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId, qty: 3 });

    expect(res.statusCode).toBe(200);
    expect(res.body.cart.items[0].quantity).toBe(5);
  });

});