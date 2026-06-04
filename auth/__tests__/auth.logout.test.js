const request = require("supertest");
const app = require("../src/app");

// mock redis
jest.mock("../src/db/redis", () => ({
  set: jest.fn()
}));

describe("Logout API", () => {

  it("should logout successfully", async () => {
    const res = await request(app)
      .get("/api/auth/logout");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("user logout sucessfully");
  });

});