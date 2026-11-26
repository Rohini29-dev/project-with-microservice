const request = require("supertest");
const app = require("../src/app");
const userModel = require("../src/models/user.model");
const bcrypt = require('bcryptjs');

describe("GET /me", () => {

  let cookie;

  beforeEach(async () => {
    const hash = await bcrypt.hash("Password1", 10);

    await userModel.create({
      email: "test@test.com",
      username: "testuser",
      password: hash,
      fullName: { firstName: "Rohini", lastName: "Test" }
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@test.com",
        password: "Password1"
      });

    cookie = res.headers["set-cookie"];
  });

  it("should return current user", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", cookie);

      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("user");
  });

});