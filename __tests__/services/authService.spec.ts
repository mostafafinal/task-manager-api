import { faker } from "@faker-js/faker";
import * as service from "../../src/services/authService";
import { User } from "../../src/models/User";
import { IUser } from "../../src/types/schemas";
import { hashPassword, verifyPassword } from "../../src/utils/bcryption";
import * as token from "../../src/utils/token";
import { resetPasswordEmail } from "../../src/utils/mail";
import { JwtPayload } from "jsonwebtoken";

jest.mock("../../src/models/User");
jest.mock("../../src/utils/bcryption");
jest.mock("../../src/utils/mail.ts");

describe("User Authentication Test", () => {
  let user: IUser;
  const originalEnv = process.env;

  beforeEach(() => {
    user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    } as IUser;

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
    User.checkUserByEmail = jest.fn().mockResolvedValue(false);
    User.create = jest.fn();
    (hashPassword as jest.Mock) = jest.fn();

    await service.registerUser(user);

    expect(User.create).toHaveBeenCalled();
    expect(hashPassword).toHaveBeenCalled();
  });

  test("User Login Test", async () => {
    User.getUser = jest.fn().mockReturnValue(user);

    (verifyPassword as jest.Mock).mockResolvedValue(true);

    const login = await service.loginUser({
      email: user.email,
      password: user.password,
    });

    expect(login).toMatchObject<IUser>(user);
  });

  test("Forget password", async () => {
    const userEmailMock: string = faker.internet.email();
    const idMock: string = faker.database.mongodbObjectId();
    const payloadMock: JwtPayload = { id: idMock };

    const selectImplementationMock = jest.fn().mockResolvedValue(idMock);
    User.findOne = jest.fn().mockReturnValue({
      select: selectImplementationMock,
    });

    jest.spyOn(token, "generateToken").mockResolvedValue("token-mock");

    await service.forgetPassword(userEmailMock);

    expect(User.findOne).toHaveBeenCalledWith({ email: userEmailMock });
    expect(token.generateToken).toHaveBeenCalledWith(
      payloadMock,
      process.env.JWT_SECRET
    );
    expect(resetPasswordEmail).toBeTruthy();
  });
});
