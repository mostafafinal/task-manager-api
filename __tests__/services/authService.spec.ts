import { prismaMock } from "../mocks/prisma";
import { faker } from "@faker-js/faker";
import * as service from "../../src/services/authService";
import { users } from "../../src/types/prisma";
import * as bcrypt from "../../src/utils/bcryption";
import * as token from "../../src/utils/token";
import * as mail from "../../src/utils/mail";
import { JwtPayload } from "jsonwebtoken";

jest.mock("../../src/utils/bcryption");
jest.mock("../../src/utils/mail.ts");

describe("User Authentication Test", () => {
  let user: users;
  const originalEnv = process.env;

  beforeEach(() => {
    user = {
      id: faker.database.mongodbObjectId(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      createdAt: faker.date.anytime(),
      updatedAt: faker.date.recent(),
      v: 0,
    };

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

  test("User Register Test", async () => {
    prismaMock.users.create.mockResolvedValue(user);
    prismaMock.users.findUnique.mockResolvedValue(null);

    jest.spyOn(bcrypt, "hashPassword");

    const createdUser = await service.registerUser(user);

    expect(prismaMock.users.findUnique).toHaveBeenCalled();
    expect(bcrypt.hashPassword).toHaveBeenCalled();
    expect(prismaMock.users.create).toHaveBeenCalled();
    expect(createdUser).toBeTruthy();
  });

  test("User Login Test", async () => {
    prismaMock.users.findUnique.mockResolvedValue(user);
    jest.spyOn(bcrypt, "verifyPassword").mockResolvedValue(true);

    const login = await service.loginUser({
      email: user.email,
      password: user.password,
    });

    expect(prismaMock.users.findUnique).toHaveBeenCalled();
    expect(bcrypt.verifyPassword).toHaveBeenCalled();
    expect(login).toMatchObject<users>(user);
  });

  test("Forget password", async () => {
    const userEmailMock: string = faker.internet.email();
    const idMock: string = faker.database.mongodbObjectId();
    const payloadMock: JwtPayload = { id: idMock };

    prismaMock.users.findUnique.mockResolvedValue({ id: idMock } as users);

    jest.spyOn(token, "generateToken").mockResolvedValue("token-mock");
    jest.spyOn(mail, "resetPasswordEmail").mockResolvedValue();

    await service.forgetPassword(userEmailMock);

    expect(prismaMock.users.findUnique).toHaveBeenCalled();
    expect(token.generateToken).toHaveBeenCalledWith(
      payloadMock,
      process.env.JWT_SECRET,
      expect.any(Object)
    );
    expect(mail.resetPasswordEmail).toBeTruthy();
  });
});
