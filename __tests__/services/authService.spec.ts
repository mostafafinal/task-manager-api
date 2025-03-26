import { faker } from "@faker-js/faker";
import { registerUser, loginUser } from "../../src/services/authService";
import { User } from "../../src/models/User";
import { IUser } from "../../src/types/schemas";
import { hashPassword, verifyPassword } from "../../src/utils/bcryption";

jest.mock("../../src/models/User");
jest.mock("../../src/utils/bcryption");

describe("User Authentication Test", () => {
  let user: IUser;

  beforeEach(() => {
    user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    } as IUser;
  });

  afterAll(() => jest.clearAllMocks());

  test("User Register Test", async () => {
    User.checkUserByEmail = jest.fn().mockResolvedValue(false);
    User.create = jest.fn();
    (hashPassword as jest.Mock) = jest.fn();

    await registerUser(user);

    expect(User.create).toHaveBeenCalled();
    expect(hashPassword).toHaveBeenCalled();
  });

  test("User Login Test", async () => {
    User.getUser = jest.fn().mockReturnValue(user);

    (verifyPassword as jest.Mock).mockResolvedValue(true);

    const login = await loginUser({
      email: user.email,
      password: user.password,
    });

    expect(login).toMatchObject<IUser>(user);
  });
});
