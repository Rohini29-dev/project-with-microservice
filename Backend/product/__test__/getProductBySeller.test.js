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
  find: jest.fn()
}));

const { createAuthMiddleware } = require('../src/middlewares/auth.middleware');
const { getProductbyseller } = require('../src/controllers/product.controller');
const productModel = require('../src/models/product.model');

describe('GET /seller (getProductbyseller)', () => {

  let app;
  let validToken;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.get(
      '/seller',
      createAuthMiddleware(['seller']),
      getProductbyseller
    );

    validToken = jwt.sign(
      { id: "seller123", role: "seller" },
      process.env.JWT_SECRET
    );
  });

  // ❌ No token
  test('❌ No token → 401', async () => {
    const res = await request(app).get('/seller');
    expect(res.statusCode).toBe(401);
  });

  // ❌ Wrong role
  test('❌ Invalid role → 403', async () => {
    const token = jwt.sign(
      { id: "user123", role: "user" },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .get('/seller')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  // ✅ Get seller products
  test('✅ Get seller products → 200', async () => {
    const mockProducts = [
      { title: "Product A" },
      { title: "Product B" }
    ];

    productModel.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockProducts)
    });

    const res = await request(app)
      .get('/seller')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual(mockProducts);

    expect(productModel.find).toHaveBeenCalledWith({
      seller: "seller123"
    });
  });

  // ✅ Pagination test
  test('✅ Pagination → skip & limit', async () => {
    const skipMock = jest.fn().mockReturnThis();
    const limitMock = jest.fn().mockResolvedValue([]);

    productModel.find.mockReturnValue({
      skip: skipMock,
      limit: limitMock
    });

    await request(app)
      .get('/seller?skip=5&limit=50')
      .set('Authorization', `Bearer ${validToken}`);

    expect(skipMock).toHaveBeenCalledWith(5);
    expect(limitMock).toHaveBeenCalledWith(20); // capped
  });

  // ❌ Internal error
  test('❌ Internal error → 500', async () => {
    productModel.find.mockImplementation(() => {
      throw new Error("DB error");
    });

    const res = await request(app)
      .get('/seller')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(500);
  });

});