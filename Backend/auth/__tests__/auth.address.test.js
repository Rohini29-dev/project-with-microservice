const request = require("supertest");
const app = require("../src/app");
const userModel = require("../src/models/user.model");
const bcrypt = require('bcryptjs');

describe("GET /users/me/addresses", () => {

  let cookie;

  beforeEach(async () => {
    const hash = await bcrypt.hash("Password1", 10);

    // create user with addresses
    await userModel.create({
      email: "test@test.com",
      username: "testuser",
      password: hash,
      fullName: {
        firstName: "Rohini",
        lastName: "Test"
      },
      addresses: [
        {
          street: "123 Street",
          city: "Bhopal",
          state: "MP",
          pincode: "462001",
          country: "India"
        }
      ]
    });

    // login to get cookie
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@test.com",
        password: "Password1"
      });

    cookie = res.headers["set-cookie"];
  });

  // ✅ SUCCESS CASE
  it("should fetch user addresses", async () => {
    const res = await request(app)
      .get("/api/auth/users/me/addresses")
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("addresses");
    expect(res.body.addresses.length).toBeGreaterThan(0);
  });

  // ❌ NO TOKEN CASE
  it("should fail without token", async () => {
    const res = await request(app)
      .get("/api/auth/users/me/addresses");

    expect(res.statusCode).toBe(401);
  });

});