import request from "supertest";
import app from "../../src/index";
import { faker } from "@faker-js/faker";
// import { closeDBForTesting } from "../prePostTesting";
import { IUser } from "../../src/types/schemas";
import * as authService from "../../src/services/authService";

// jest.mock("../../src/types/authService");

describe("Auth Controller Test", () => {
  const user: IUser = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  jest.spyOn(authService, "registerUser").mockResolvedValue(user);

  afterAll(() => jest.clearAllMocks());

  test("Register new user", async () => {
    const res = await request(app)
      .post("/user/register")
      .send({
        ...user,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("success");
    expect(res.body.user).toMatchObject<IUser>({
      ...user,
      password: res.body.user.password,
    });
  });
});
