const request = require("supertest");
const app = require("../src/app");
const userModel = require("../src/models/user.model");
const bcrypt = require('bcryptjs');

describe("DELETE /users/me/addresses/:addressId", () => {

  let cookie;
  let addressId;

  beforeEach(async () => {
    const hash = await bcrypt.hash("Password1", 10);

    // create user with one address
    const user = await userModel.create({
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
          zip: "462001",
          country: "India"
        }
      ]
    });

    // store addressId
    addressId = user.addresses[0]._id.toString();

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
  it("should delete address successfully", async () => {
    const res = await request(app)
      .delete(`/api/auth/users/me/addresses/${addressId}`)
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("user address deleted successfully");
    expect(res.body.addresses.length).toBe(0);
  });

  // ❌ ADDRESS NOT FOUND
  it("should return 404 if address not found", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const res = await request(app)
      .delete(`/api/auth/users/me/addresses/${fakeId}`)
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(404);
  });

  // ❌ NO TOKEN
  it("should fail without token", async () => {
    const res = await request(app)
      .delete(`/api/auth/users/me/addresses/${addressId}`);

    expect(res.statusCode).toBe(401);
  });

});