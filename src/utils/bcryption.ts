import bcrypt from "bcrypt";
import { HashPassword, VerifyPassword } from "../types/bcryption";

export const hashPassword: HashPassword["hashPassword"] = async (password) => {
  const hash = await bcrypt.hash(password, 10);

  return hash;
};

export const verifyPassword: VerifyPassword["verifyPassword"] = async (
  orginalPassword,
  hashedPassword,
) => {
  const isValid = await bcrypt.compare(orginalPassword, hashedPassword);

  return isValid;
};
