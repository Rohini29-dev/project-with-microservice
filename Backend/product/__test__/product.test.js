
jest.mock('uuid', () => ({
  v4: () => 'mock-uuid'
}));


const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

jest.mock("../src/borker/borker", () => ({
    publishToQueue: jest.fn().mockResolvedValue(true)
}));

const { createAuthMiddleware } = require('../src/middlewares/auth.middleware');
const { createProduct } = require('../src/controllers/product.controller');

// 🔥 MOCKS
jest.mock('../src/models/product.model', () => ({
  create: jest.fn()
}));

jest.mock('../src/services/imagekit.service', () => ({
  uploadFile: jest.fn()
}));

const productModel = require('../src/models/product.model');
const { uploadFile } = require('../src/services/imagekit.service');

describe('Create Product API (NO app.js)', () => {

  let app;
  let validToken;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // fake multer
    const fakeMulter = (req, res, next) => {
      req.files = [
        {
          buffer: Buffer.from("test"),
          originalname: "test.jpg"
        }
      ];
      next();
    };

    app.post(
      '/',
      createAuthMiddleware(['user','seller']),
      fakeMulter,
      createProduct
    );

    validToken = jwt.sign(
      { id: "user123", role: "seller" },
      process.env.JWT_SECRET
    );
  });

  test('❌ No token → 401', async () => {
    const res = await request(app).post('/');
    expect(res.statusCode).toBe(401);
  });

  test('❌ Invalid role → 403', async () => {
    const token = jwt.sign(
      { id: "user123", role: "guest" },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  test('❌ Missing fields → 400', async () => {
    const res = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${validToken}`)
      .send({});

    expect(res.statusCode).toBe(400);
  });

  test('✅ Product created → 201', async () => {
    uploadFile.mockResolvedValue({ url: "fake-url" });

    productModel.create.mockResolvedValue({
      title: "Test",
      priceAmount: 100
    });

    const res = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        title: "Test",
        priceAmount: 100
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("product created");
  });

  test('❌ Internal error → 500', async () => {
    productModel.create.mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        title: "Test",
        priceAmount: 100
      });

    expect(res.statusCode).toBe(500);
  });

});