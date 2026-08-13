const request = require("supertest");

jest.mock("../src/borker/borker", () => ({
    publishToQueue: jest.fn().mockResolvedValue(true)
}));

const app = require("../src/app");

describe("Auth Register API", () => {

    it("should register a user successfully", async () => {

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                email: "test@example.com",
                username: "testuser",
                password: "Password1",
                role: "user",
                fullName: {
                    firstName: "Rohini",
                    lastName: "Test"
                }
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("user");
    });

});