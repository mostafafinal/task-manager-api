import { faker } from "@faker-js/faker";
import { registerUser, loginUser } from "../../src/services/authService";
import { closeDBForTesting, connectDBForTesting } from "../prePostTesting";
import { IUser } from "../../src/interfaces/schemas";
import { User } from "../../src/models/User";

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
});
