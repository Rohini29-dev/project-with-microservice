
jest.mock('uuid', () => ({
  v4: () => 'mock-uuid'
}));

const request = require('supertest');
const express = require('express');

const { getProduct } = require('../src/controllers/product.controller');

// 🔥 mock productModel
jest.mock('../src/models/product.model', () => ({
  find: jest.fn()
}));

const productModel = require('../src/models/product.model');

describe('GET /products API', () => {

  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.get('/', getProduct);
  });

  test('✅ Get all products', async () => {
    const mockProducts = [{ title: "A" }, { title: "B" }];

    productModel.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockProducts)
    });

    const res = await request(app).get('/');

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual(mockProducts);
  });

  test('✅ Search query (q)', async () => {
    productModel.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([])
    });

    await request(app).get('/?q=phone');

    expect(productModel.find).toHaveBeenCalledWith({
      $text: { $search: 'phone' }
    });
  });

  test('✅ Price filter (min + max)', async () => {
    productModel.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([])
    });

    await request(app).get('/?miniprice=100&maxprice=500');

    expect(productModel.find).toHaveBeenCalledWith({
      'price.amount': {
        $gte: 100,
        $lte: 500
      }
    });
  });

  test('✅ Only min price', async () => {
    productModel.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([])
    });

    await request(app).get('/?miniprice=200');

    expect(productModel.find).toHaveBeenCalledWith({
      'price.amount': {
        $gte: 200
      }
    });
  });

  test('✅ Pagination (skip & limit)', async () => {
    const skipMock = jest.fn().mockReturnThis();
    const limitMock = jest.fn().mockResolvedValue([]);

    productModel.find.mockReturnValue({
      skip: skipMock,
      limit: limitMock
    });

    await request(app).get('/?skip=5&limit=50');

    expect(skipMock).toHaveBeenCalledWith(5);
    expect(limitMock).toHaveBeenCalledWith(20); // capped at 20
  });

  test('❌ Internal error → 500', async () => {
    productModel.find.mockImplementation(() => {
      throw new Error("DB error");
    });

    const res = await request(app).get('/');

    expect(res.statusCode).toBe(500);
  });

});