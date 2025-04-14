import request from "supertest";
import app from "../../src/index";
import { faker } from "@faker-js/faker";
import * as service from "../../src/services/authService";
import { prisma } from "../../src/configs/prisma";
import { users } from "../../src/types/prisma";
import { ENV_VARS } from "../../src/configs/envs";

const prismaMock = jest.mocked(prisma);
jest.mock("../../src/services/authService");

describe("authentication controller suite", () => {
  const user: users = {
    id: faker.database.mongodbObjectId(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: "35335TwtwEW4#@1",
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.recent(),
    v: 0,
  };

  afterEach(() => jest.clearAllMocks());

  test("register new user request", async () => {
    jest.spyOn(service, "registerUser").mockResolvedValue(true);

    const res = await request(app)
      .post("/auth/register")
      .send({
        ...user,
        confirmPassword: user.password,
      });

    expect(service.registerUser).toHaveBeenCalled();
    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe("success");
  });

  test("forget password request", async () => {
    jest.spyOn(service, "forgetPassword");

    const res = await request(app)
      .post("/auth/forgetpassword")
      .send({ email: user.email });

    expect(service.forgetPassword).toHaveBeenCalledWith(user.email);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeDefined();
  });

  test("logout request", async () => {
    prismaMock.users.findUnique.mockResolvedValue(user);

    const res = await request(app)
      .delete("/auth/logout")
      .set("Cookie", `x-auth-token=${ENV_VARS.JWT_SIGNED_TOKEN}`);

    expect(res.status).toEqual(204);
  });
});
