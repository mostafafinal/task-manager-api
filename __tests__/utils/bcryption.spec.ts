import { faker } from "@faker-js/faker";
import { hashPassword, verifyPassword } from "../../src/utils/bcryption";

describe("Bycription Functionality Testing", () => {
    const password: string = faker.internet.password();

    test("Password Hashing Test", async () => {
        const hashedPassword = await hashPassword(password);

        expect(hashedPassword).toBeDefined();
    });

    test("Password Verification Test", async () => {
        const hashedPassword = await hashPassword(password);

        const isVerified = await verifyPassword(password, hashedPassword);

        expect(isVerified).toBe(true);
    });
});
