import { connectDBForTesting, closeDBForTesting } from "../prePostTesting";
import { User } from "../../src/models/User";
import { faker } from "@faker-js/faker";
import { IUser } from "../../src/interfaces/schemas";

describe("User model testing", () => {
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

  test("User creation test", async () => {
    const createUser = new User({ ...user });
    const createdUser = await createUser.save();

    expect(createdUser).toMatchObject({
      ...user,
    });
  });

  test("User existence test", async () => {
    await new User({ ...user }).save();

    const isExisted = await User.checkUserByEmail(user.email);

    expect(isExisted).toBe(true);
  });

  test("Get user test", async () => {
    await new User({ ...user }).save();

    const getUser = await User.getUser(user.email);

    expect(getUser).toMatchObject<IUser>({ ...getUser });
  });
});
