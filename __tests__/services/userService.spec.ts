import { prisma } from "../../src/configs/prisma";
import { faker } from "@faker-js/faker";
import * as service from "../../src/services/userService";
import { users } from "../../src/types/prisma";
import * as bcrypt from "../../src/utils/bcryption";
import * as token from "../../src/utils/token";
import { JwtPayload } from "jsonwebtoken";

const prismaMock = jest.mocked(prisma);

describe("User service suite", () => {
  const user: users = {
    id: faker.database.mongodbObjectId(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.recent(),
    v: 0,
  };
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();

    process.env = {
      ...originalEnv,
      JWT_SECRET: "secret-mock",
    };
  });

  afterEach(() => {
    jest.clearAllMocks();

    process.env = originalEnv;
  });

  test("get user data", async () => {
    prismaMock.users.findUnique.mockResolvedValue(user);

    const returnedUser = await service.getUserById(user.id);

    expect(prismaMock.users.findUnique).toHaveBeenCalled();
    expect(returnedUser).toMatchObject<users>(user);
  });

  test("change user password", async () => {
    prismaMock.users.findUnique.mockResolvedValue({
      password: "12345678",
    } as users);

    prismaMock.users.update.mockResolvedValue(user);

    (bcrypt.verifyPassword as jest.Mock) = jest
      .fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    (bcrypt.hashPassword as jest.Mock) = jest
      .fn()
      .mockResolvedValue("12345678910");

    const result = await service.changeUserPassword(
      user.id,
      "12345678",
      "12345678910"
    );

    expect(prismaMock.users.findUnique).toHaveBeenCalled();
    expect(bcrypt.verifyPassword).toHaveBeenCalledTimes(2);
    expect(bcrypt.hashPassword).toHaveBeenCalled();
    expect(prismaMock.users.update).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  test("reset user password", async () => {
    const newPaswordMock: string = "123456789";
    const tokenMock: string = "token-mock";
    const payloadMock: JwtPayload = { id: user.id };

    jest.spyOn(token, "verifyToken").mockResolvedValue(payloadMock as never);

    prismaMock.users.update.mockResolvedValue(user);

    (bcrypt.hashPassword as jest.Mock) = jest
      .fn()
      .mockResolvedValue(newPaswordMock);

    const result = await service.resetUserPassword(tokenMock, newPaswordMock);

    expect(token.verifyToken).toHaveBeenCalledWith(
      tokenMock,
      process.env.JWT_SECRET
    );
    expect(bcrypt.hashPassword).toHaveBeenCalledWith(newPaswordMock);
    expect(prismaMock.users.update).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  test("delete user", async () => {
    prismaMock.users.delete.mockResolvedValue(user);

    const result = await service.deleteUserById(user.id);

    expect(prismaMock.users.delete).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });
});
