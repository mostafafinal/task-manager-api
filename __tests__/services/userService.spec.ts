import { Types } from "mongoose";
import { User } from "../../src/models/User";
import { faker } from "@faker-js/faker";
import * as service from "../../src/services/userService";
import { IUser } from "../../src/types/schemas";

jest.mock("../../src/models/User");

describe("User service suite", () => {
  const id: Types.ObjectId = new Types.ObjectId(
    faker.database.mongodbObjectId()
  );
  const user: Partial<IUser> = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
  };

  test("get user data", async () => {
    User.findById = jest.fn().mockResolvedValue(user);

    const userData: Partial<IUser> | undefined = await service.getUserById(id);

    expect(User.findById).toHaveBeenCalledWith({ id: id });
    expect(userData).toMatchObject<Partial<IUser>>(user);
  });
});
