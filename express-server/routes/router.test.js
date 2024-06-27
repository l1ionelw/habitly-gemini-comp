const app = require("../app");
const request = require("supertest");
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})

describe("Test root API path", () => {
    test("root path should respond to get request with Hello World", () => {
        return request(app).get("/").expect(200);
    })
})

describe("Test habit complete", () => {
    test("should return 200 with records array when new day", async () => {
        const resp = await request(app).post("/api/completehabit").send({})
    })
})