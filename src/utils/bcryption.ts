import bcrypt from "bcrypt";
import { HashPassword, VerifyPassword } from "../interfaces/bcryption";

export const hashPassword: HashPassword["hashPassword"] = async (password) => {
    const hash = await bcrypt.hash(password, 10);

    return hash;
};

export const verifyPassword: VerifyPassword["verifyPassword"] = async (
    orginalPassword: string,
    hashedPassword: string
): Promise<boolean> => {
    const isValid = bcrypt.compare(orginalPassword, hashedPassword);

    return isValid;
};
