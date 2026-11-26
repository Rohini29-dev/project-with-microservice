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
  findById: jest.fn(),
  findByIdAndDelete: jest.fn()
}));

const { createAuthMiddleware } = require('../src/middlewares/auth.middleware');
const { deleteProduct } = require('../src/controllers/product.controller');
const productModel = require('../src/models/product.model');

describe('DELETE /:id (deleteProduct)', () => {

  let app;
  let validToken;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.delete(
      '/:id',
      createAuthMiddleware(['seller']),
      deleteProduct
    );

    validToken = jwt.sign(
      { id: "user123", role: "seller" },
      process.env.JWT_SECRET
    );
  });

  // ❌ Invalid ID
  test('❌ Invalid productId → 400', async () => {
    const res = await request(app)
      .delete('/invalid-id')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(400);
  });

  // ❌ Product not found
  test('❌ Product not found → 404', async () => {
    productModel.findById.mockResolvedValue(null);

    const res = await request(app)
      .delete('/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(404);
  });

  // ❌ Not owner
  test('❌ Not owner → 403', async () => {
    productModel.findById.mockResolvedValue({
      seller: 'anotherUser'
    });

    const res = await request(app)
      .delete('/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(403);
  });

  // ✅ Success delete
  test('✅ Product deleted → 200', async () => {
    productModel.findById.mockResolvedValue({
      seller: 'user123'
    });

    productModel.findByIdAndDelete.mockResolvedValue(true);

    const res = await request(app)
      .delete('/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("product deleted successfully");
  });

  // ❌ Internal error
  test('❌ Internal error → 500', async () => {
    productModel.findById.mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .delete('/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(500);
  });

});