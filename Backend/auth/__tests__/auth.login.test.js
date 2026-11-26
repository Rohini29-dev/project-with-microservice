const request = require("supertest");
const app = require("../src/app");
const userModel = require("../src/models/user.model");
const bcrypt = require('bcryptjs');

describe("Login API", () => {

  beforeEach(async () => {
    const hash = await bcrypt.hash("Password1", 10);

    await userModel.create({
      email: "test@test.com",
      username: "testuser",
      password: hash,
      fullName: {
        firstName: "Rohini",
        lastName: "Test"
      }
    });
  });

  it("should login successfully", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@test.com",
        password: "Password1"
      });

    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("should fail with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@test.com",
        password: "Wrong123"
      });

    expect(res.statusCode).toBe(401);
  });

});