import request from "supertest";
import app from "../../src/index";
import { faker } from "@faker-js/faker";
import * as authService from "../../src/services/authService";

jest.mock("../../src/services/authService");

describe("authentication controller suite", () => {
  const user = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: "35335TwtwEW4#@1",
  };

  afterEach(() => jest.clearAllMocks());

  test("register new user request", async () => {
    jest.spyOn(authService, "registerUser").mockResolvedValue(true);

    const res = await request(app)
      .post("/auth/register")
      .send({
        ...user,
        confirmPassword: user.password,
      });

    expect(authService.registerUser).toHaveBeenCalledWith(user);
    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe("success");
  });

  test("forget password request", async () => {
    jest.spyOn(authService, "forgetPassword");

    const res = await request(app)
      .post("/auth/forgetpassword")
      .send({ email: user.email });

    expect(authService.forgetPassword).toHaveBeenCalledWith(user.email);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeDefined();
  });

  test("logout request", async () => {
    const res = await request(app)
      .delete("/auth/logout")
      .set("Cookie", `x-auth-token=${process.env.JWT_SIGNED_TOKEN}`);

    expect(res.status).toEqual(204);
  });
});
