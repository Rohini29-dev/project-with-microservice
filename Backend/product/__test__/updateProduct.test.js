const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

// 🔥 mocks FIRST
jest.mock('uuid', () => ({
  v4: () => 'mock-uuid'
}));

jest.mock('../src/services/imagekit.service', () => ({
  uploadFile: jest.fn()
}));

jest.mock('../src/models/product.model', () => ({
  findById: jest.fn()
}));

const { createAuthMiddleware } = require('../src/middlewares/auth.middleware');
const { updateProduct } = require('../src/controllers/product.controller');
const productModel = require('../src/models/product.model');

describe('PATCH /:id (updateProduct)', () => {

  let app;
  let validToken;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.patch(
      '/:id',
      createAuthMiddleware(['seller']),
      updateProduct
    );

    validToken = jwt.sign(
      { id: "user123", role: "seller" },
      process.env.JWT_SECRET
    );
  });

  // ❌ Invalid ObjectId
  test('❌ Invalid productId → 400', async () => {
    const res = await request(app)
      .patch('/invalid-id')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(400);
  });

  // ❌ Product not found
  test('❌ Product not found → 404', async () => {
    productModel.findById.mockResolvedValue(null);

    const res = await request(app)
      .patch('/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(404);
  });

  // ❌ Unauthorized (not owner)
  test('❌ Not owner → 403', async () => {
    productModel.findById.mockResolvedValue({
      seller: 'anotherUser',
      save: jest.fn()
    });

    const res = await request(app)
      .patch('/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(403);
  });

  // ✅ Update success
  test('✅ Product updated → 200', async () => {
    const mockProduct = {
      seller: 'user123',
      title: 'Old',
      price: { amount: 100, currency: 'INR' },
      save: jest.fn().mockResolvedValue(true)
    };

    productModel.findById.mockResolvedValue(mockProduct);

    const res = await request(app)
      .patch('/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        title: "New Title",
        price: { amount: 200 }
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("product update");
    expect(mockProduct.title).toBe("New Title");
    expect(mockProduct.price.amount).toBe(200);
  });

  // ❌ Internal error
  test('❌ Internal error → 500', async () => {
    productModel.findById.mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .patch('/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(500);
  });

});