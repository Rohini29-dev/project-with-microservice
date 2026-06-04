const request = require("supertest");
const app = require("../src/app");
const userModel = require("../src/models/user.model");
const bcrypt = require('bcryptjs');

describe("POST /users/me/addresses", () => {

  let cookie;

  beforeEach(async () => {
    const hash = await bcrypt.hash("Password1", 10);

    await userModel.create({
      email: "test@test.com",
      username: "testuser",
      password: hash,
      fullName: {
        firstName: "Rohini",
        lastName: "Test"
      },
      addresses: []
    });

    // login
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@test.com",
        password: "Password1"
      });

    cookie = res.headers["set-cookie"];
  });

  // ✅ SUCCESS CASE
  it("should add address successfully", async () => {
    const res = await request(app)
      .post("/api/auth/users/me/addresses")
      .set("Cookie", cookie)
      .send({
        street: "123 Street",
        city: "Bhopal",
        state: "MP",
        zip: "462001",
        country: "India",
        isDefult: true
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("addresses");
    expect(res.body.addresses.length).toBe(1);
  });

  // ❌ VALIDATION FAIL
  it("should fail with invalid data", async () => {
    const res = await request(app)
      .post("/api/auth/users/me/addresses")
      .set("Cookie", cookie)
      .send({
        street: "",
        city: "",
      });

    expect(res.statusCode).toBe(400);
  });

  // ❌ NO TOKEN
  it("should fail without token", async () => {
    const res = await request(app)
      .post("/api/auth/users/me/addresses")
      .send({
        street: "123 Street",
        city: "Bhopal",
        state: "MP",
        zip: "462001",
        country: "India"
      });

    expect(res.statusCode).toBe(401);
  });

});