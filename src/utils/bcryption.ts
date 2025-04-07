import { hash, compare } from "bcrypt";

export type HashPassword = (password: string) => Promise<string>;

export type VerifyPassword = (
  orginalPassword: string,
  hashedPassword: string
) => Promise<boolean>;

export const hashPassword: HashPassword = async (password) => {
  const hashedPassword = await hash(password, 10);

  return hashedPassword;
};

export const verifyPassword: VerifyPassword = async (
  orginalPassword,
  hashedPassword
) => {
  const isValid = await compare(orginalPassword, hashedPassword);

  return isValid;
};
