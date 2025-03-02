import request from "supertest";
import app from "../../src/index";
import { faker } from "@faker-js/faker"
import { closeDBForTesting } from "../prePostTesting";
import { IUser } from "../../src/interfaces/schemas";
import { User } from "../../src/models/User";

describe("Auth Controller Test", () => {
  let user: IUser;

  afterAll(async () => {
    await User.collection.drop();

    await closeDBForTesting();
  })

  beforeEach(() => {
    user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  })

  test("Register new user", async () => {
    const res = await request(app)
      .post('/user/register')
      .send({
        ...user
      })

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe("success");
      expect(res.body.user).toMatchObject<IUser>({...user, password: res.body.user.password})
  })
});
