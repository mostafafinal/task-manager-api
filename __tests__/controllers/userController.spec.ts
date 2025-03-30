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

  test("change user password request", async () => {
    (service.changeUserPassword as jest.Mock) = jest.fn();

    const res: Response = await request(app)
      .put("/user/changepassword")
      .send({ oldPassword: "12345678", newPassword: "123456789" })
      .set("Cookie", `x-auth-token=${process.env.JWT_SIGNED_TOKEN}`);

    expect(service.changeUserPassword).toHaveBeenCalled();
    expect(res.statusCode).toEqual(201);
  });

  test("delete user by id request", async () => {
    (service.deleteUserById as jest.Mock) = jest.fn();

    const res: Response = await request(app)
      .delete("/user/deleteaccount")
      .set("Cookie", `x-auth-token=${process.env.JWT_SIGNED_TOKEN}`);

    expect(service.deleteUserById).toHaveBeenCalled();
    expect(res.statusCode).toEqual(204);
  });
});
