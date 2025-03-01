import request from "supertest";
import app from "../../src/index";
import { faker } from "@faker-js/faker"
import { closeDBForTesting, connectDBForTesting } from "../prePostTesting";
import { IUser } from "../../src/interfaces/schemas";

describe("Auth Controller Test", () => {
  let user: IUser;
  
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
  })
});
