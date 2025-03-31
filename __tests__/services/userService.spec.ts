import { Types } from "mongoose";
import { User } from "../../src/models/User";
import { faker } from "@faker-js/faker";
import * as service from "../../src/services/userService";
import { IUser } from "../../src/types/schemas";
import * as bcrypt from "../../src/utils/bcryption";
import agenda from "../../src/configs/agenda";

jest.mock("../../src/models/User");
jest.mock("../../src/utils/bcryption");

describe("User service suite", () => {
  const id: Types.ObjectId = new Types.ObjectId(
    faker.database.mongodbObjectId()
  );
  const user: Partial<IUser> = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
  };

  afterEach(() => jest.clearAllMocks());

  test("get user data", async () => {
    User.findById = jest.fn().mockResolvedValue(user);

    const userData: Partial<IUser> | undefined = await service.getUserById(id);

    expect(User.findById).toHaveBeenCalledWith({ id: id });
    expect(userData).toMatchObject<Partial<IUser>>(user);
  });

  test("change user password", async () => {
    const mockReturnedPassword = jest.fn().mockResolvedValue("12345678");

    (User.findById as jest.Mock).mockReturnValue({
      select: mockReturnedPassword,
    });

    User.updateOne = jest.fn();
    (bcrypt.verifyPassword as jest.Mock) = jest
      .fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    (bcrypt.hashPassword as jest.Mock) = jest
      .fn()
      .mockResolvedValue("12345678910");

    await service.changeUserPassword(id, "12345678", "12345678910");

    expect(User.findById).toHaveBeenCalledWith(id);
    expect(User.updateOne).toHaveBeenCalledWith(
      { _id: id },
      { password: "12345678910" }
    );
    expect(bcrypt.verifyPassword).toHaveBeenCalledTimes(2);
    expect(bcrypt.hashPassword).toHaveBeenCalled();
  });

  test("reset user password", async () => {
    const mockReturnedPassword = jest.fn().mockResolvedValue("12345678");
    const newPaswordMock: string = "123456789";
    (User.findById as jest.Mock).mockReturnValue({
      select: mockReturnedPassword,
    });

    User.updateOne = jest.fn();

    (bcrypt.hashPassword as jest.Mock) = jest
      .fn()
      .mockResolvedValue(newPaswordMock);

    await service.resetUserPassword(id, newPaswordMock);

    expect(bcrypt.hashPassword).toHaveBeenCalledWith(newPaswordMock);
    expect(User.updateOne).toHaveBeenCalledWith(
      { _id: id },
      { password: newPaswordMock }
    );
  });

  test("delete user", async () => {
    User.deleteOne = jest.fn();
    jest.spyOn(agenda, "now");

    await service.deleteUserById(id);

    expect(User.deleteOne).toHaveBeenCalledWith({ _id: id });
    expect(agenda.now).toHaveBeenCalledTimes(2);
  });
});
