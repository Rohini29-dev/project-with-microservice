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

describe("Update Cart Item API", () => {

  // ✅ success case
  it("should update item quantity successfully", async () => {
    const token = generateToken();
    const productId = new mongoose.Types.ObjectId();

    // create cart first
    await cartModel.create({
      user: jwt.decode(token).id,
      items: [{ productId, quantity: 2 }]
    });

    const res = await request(app)
      .patch(`/api/carts/items/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ qty: 3 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Item update");
    expect(res.body.cart.items[0].quantity).toBe(5);
  });

  // ❌ cart not found
  it("should return 404 if cart not found", async () => {
    const token = generateToken();
    const productId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .patch(`/api/carts/items/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ qty: 2 });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("cart not found");
  });

  // ❌ item not found
  it("should return 404 if item not found in cart", async () => {
    const token = generateToken();
    const productId = new mongoose.Types.ObjectId();

    // create empty cart
    await cartModel.create({
      user: jwt.decode(token).id,
      items: []
    });

    const res = await request(app)
      .patch(`/api/carts/items/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ qty: 2 });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("cart item not found");
  });

  // ❌ validation error
  it("should return 400 for invalid qty", async () => {
    const token = generateToken();
    const productId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .patch(`/api/carts/items/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ qty: -1 });

    expect(res.statusCode).toBe(400);
  });

  // ❌ unauthorized
  it("should return 401 if token not provided", async () => {
    const productId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .patch(`/api/carts/items/${productId}`)
      .send({ qty: 2 });

    expect(res.statusCode).toBe(401);
  });

  // ❌ forbidden
  it("should return 403 if role not allowed", async () => {
    const token = generateToken("admin");
    const productId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .patch(`/api/carts/items/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ qty: 2 });

    expect(res.statusCode).toBe(403);
  });

});