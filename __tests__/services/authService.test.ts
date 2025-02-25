import { faker } from "@faker-js/faker";
import { registerUser } from "../../src/services/authService";
import { closeDBForTesting, connectDBForTesting } from "../prePostTesting";
import { IUser } from "../../src/interfaces/schemas";
import { User } from "../../src/models/User";

describe("User Authentication Test", () => {
    let user: IUser;

    beforeAll(async () => await connectDBForTesting());

    afterAll(async () => {
        await User.collection.drop();

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

    test("User Register Test", async () => {
        const createdUser = await registerUser(user);

        expect(createdUser).toMatchObject<IUser>({
            ...user,
            password: createdUser.password,
        });
    });
});
