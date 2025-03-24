import { faker } from "@faker-js/faker";
import request, { Response } from "supertest";
import app from "../../src/index";
import * as service from "../../src/services/userService";
import { IUser } from "../../src/types/schemas";

jest.mock("../../src/types/schemas");

describe("User controller suite", () => {
  const user: Partial<IUser> = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
  };

  test("get user by id request", async () => {
    (service.getUserById as jest.Mock) = jest.fn().mockResolvedValue(user);

    const res: Response = await request(app)
      .get("/user")
      .set("Cookie", `x-auth-token=${process.env.JWT_SIGNED_TOKEN}`);

    expect(service.getUserById).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res.body.user).toBeDefined();
  });
});
