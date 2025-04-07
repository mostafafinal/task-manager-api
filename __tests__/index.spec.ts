import request from "supertest";
import app from "../src/index";

describe("App suite", () => {
  test("app launch request", async () => {
    const res = await request(app).get("/");

    expect(res.status).toEqual(200);
    expect(res.text).toBe("Hi, I'm working!");
  });
});
