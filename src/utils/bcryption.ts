/**
 * @file bcryption.ts
 * @author Mostafa Hasan // (mostafafinal55@gmail.com)
 * @summary
 *  This file declares a combination of bycryption utils
 *  they're responsible for hashing and validating hashed passwords
 *
 * @version 1.0.0
 * @date 2025-02-25
 * @copyright Copyrights (c) 2025
 */

import { hash, compare } from "bcrypt";
import { logger } from "./logger";

export type HashPassword = (password: string) => Promise<string | undefined>;

/**
 * HashPassword util hashes any provided password
 * to an unhashed password string for security purposes
 *
 * @method hash bcrypt method would be used for hashing passwords
 *
 * @param password the password to be hashed
 * @returns hashed password with 10 rounds
 * @example hashPassword("password")
 */

export const hashPassword: HashPassword = async (password) => {
  try {
    if (!password || password === "") throw new Error("invalid password");

    const hashedPassword = await hash(password, 10);

    return hashedPassword;
  } catch (error) {
    logger.error(error, "HASH PASSWORD UTIL EXCEPTION");
  }
};

export type VerifyPassword = (
  orginalPassword: string,
  hashedPassword: string
) => Promise<boolean | undefined>;

/**
 * VerifyPassword util verifies any provided password
 * and check if it had been hashed by bcrypt hash method or not
 *
 * @method compare bcrypt method would be used for verifying hashed passwords
 *
 * @param orginalPassword the original or raw password
 * @param hashedPassword the previously hashed password
 * @returns truthy or falsy result
 * @example verifyPassword("old-password", "hashed-password")
 */

export const verifyPassword: VerifyPassword = async (
  orginalPassword,
  hashedPassword
) => {
  try {
    if (
      !orginalPassword ||
      orginalPassword === "" ||
      !hashedPassword ||
      hashedPassword === ""
    )
      throw new Error("invalid one or both of provided passwords");

    const isValid = await compare(orginalPassword, hashedPassword);

    return isValid;
  } catch (error) {
    logger.error(error, "VERIFY PASSWORD UTIL EXCEPTION");
  }
};
