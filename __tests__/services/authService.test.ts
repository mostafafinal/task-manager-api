import { faker } from "@faker-js/faker";
import { registerUser, loginUser } from "../../src/services/authService";
import { closeDBForTesting, connectDBForTesting } from "../prePostTesting";
import { IUser } from "../../src/interfaces/schemas";

describe("User Authentication Test", () => {
  let user: IUser;

  beforeAll(async () => await connectDBForTesting());

  afterAll(async () => {
    // await User.collection.drop();

    await closeDBForTesting();
  });

  beforeEach(() => {
    user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  });

  const createUser = async () => await registerUser(user);

  test("User Register Test", async () => {
    const createdUser = await createUser();

    expect(createdUser).toMatchObject<IUser>({
      ...user,
      password: createdUser.password,
    });
  });

  test("User Login Test", async () => {
    const createdUser = await createUser();

    const login = await loginUser({
      email: createdUser.email,
      password: user.password,
    });

    expect(login).toBe("Logged in successfully!");
  });
});
