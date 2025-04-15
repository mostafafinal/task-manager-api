/**
 * @file token.ts
 * @author Mostafa Hasan // (mostafafinal55@gmail.com)
 * @summary
 *  This file declares a combination of token utils
 *  they're responsible for signing and verfiying encrypted
 *  json web tokens for authentication & authorization purposes
 * @version 1.0.0
 * @date 2025-03-31
 * @copyright Copyrights (c) 2025
 */

import { JwtPayload, Secret, SignOptions, sign, verify } from "jsonwebtoken";
import { logger } from "./logger";

/**
 * @description
 *  GenerateToken util provides an encrypted json web token
 *  for user authorization purposes
 *
 * @method sign jsonwebtoken method would be used for signing & encrypting tokens
 *
 * @param payload contains user credentials
 * @param secret the secert that would be used to encrypt the token
 * @param options e.g. algorithm used for token encryption, token expiration dates, etc
 * @returns a signed jwt token
 * @example
 * generateToken({id: "user-id"}, "secret-key", {alg: "HS256", exp: "10m"})
 */

export const generateToken = async (
  payload: JwtPayload,
  secret: Secret,
  options: SignOptions
) => {
  try {
    if (!payload || Object.keys(payload).length === 0 || !secret)
      throw new Error("invalid payload or secret");

    const token: string = sign(payload, secret, options);

    return token;
  } catch (error) {
    logger.error(error, "GENEREATE TOKEN UTIL EXCEPTION");
  }
};

/**
 * @description
 *  VerifyToken util verifys an encrypted json web token
 *  for user authorization & authentication purposes
 *
 * @method verify jsonwebtoken method would be used for verifing tokens
 *
 * @param token contains user credentials
 * @param secret the secert that would be used to encrypt the token
 * @returns a valid payload
 * @example
 * verifyToken("encrypted.token.string", "secret-key")
 */

export const verifyToken = async (token: string, secret: Secret) => {
  try {
    if (!token || !secret) throw new Error("invalid token or secret");

    const validToken = verify(token, secret, (err, payload) => {
      if (err) throw new Error("failed to verify token");

      return payload;
    });

    return validToken;
  } catch (error) {
    logger.error(error, "VERIFY TOKEN UTIL EXCEPTION");
  }
};
