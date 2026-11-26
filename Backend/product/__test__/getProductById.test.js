const request = require('supertest');
const express = require('express');

// ✅ mocks FIRST (very important order)
jest.mock('uuid', () => ({
  v4: () => 'mock-uuid'
}));

jest.mock('../src/services/imagekit.service', () => ({
  uploadFile: jest.fn()
}));

jest.mock('../src/models/product.model', () => ({
  findById: jest.fn()
}));

// 👉 then imports
const { getProductById } = require('../src/controllers/product.controller');
const productModel = require('../src/models/product.model')




describe('GET /:id (getProductById)', () => {

  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.get('/:id', getProductById);
  });

  // ✅ Success case
  test('✅ Should return product by ID → 200', async () => {
    const mockProduct = { _id: '123', title: 'Test Product' };

    productModel.findById.mockResolvedValue(mockProduct);

    const res = await request(app).get('/123');

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual(mockProduct);
  });

  // ❌ Product not found
  test('❌ Product not found → 404', async () => {
    productModel.findById.mockResolvedValue(null);

    const res = await request(app).get('/123');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('product not found');
  });

  // ❌ Invalid ID / DB error
  test('❌ Internal error → 500', async () => {
    productModel.findById.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/123');

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('error fetching product');
  });

});