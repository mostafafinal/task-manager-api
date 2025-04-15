/**
 * @file authService.ts
 * @author Mostafa Hasan // (mostafafinal55@gmail.com)
 * @summary
 *  This file declares a combination of authentication services
 *  they're responsible for handling user authentication functionalities
 * @version 1.0.0
 * @date 2025-02-25
 * @copyright Copyrights (c) 2025
 */

import { prisma } from "../configs/prisma";
import { hashPassword, verifyPassword } from "../utils/bcryption";
import { users } from "../types/prisma";
import { generateToken } from "../utils/token";
import { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { resetPasswordEmail } from "../utils/mail";
import { ENV_VARS } from "../configs/envs";
import { logger } from "../utils/logger";

export type RegisterUser = (data: users) => Promise<boolean | undefined>;

/**
 * @description
 *  RegisterUser service registers user credentials into databases
 *
 * @function hashPassword util would be used for hashing user password
 *                          before adding it to the database
 * @function prisma API would be used to register user into the databases
 *
 * @param userData user credentials
 * @returns truthy result (user has been registered into the database)
 * @example registerUser({firstName: "Mostafa", lastName: "Hasan", email: "mostafa@gmail.com", password: "password"})
 */

export const registerUser: RegisterUser = async (userData) => {
  try {
    const isExisted = await prisma.users.findUnique({
      where: { email: userData.email },
    });

    if (isExisted) throw new Error("user is already existed");

    const hashedPassword = await hashPassword(userData.password);

    if (!hashedPassword) throw new Error("failed to hash user password");

    const createdUser = await prisma.users.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    if (createdUser) return true;
  } catch (error) {
    logger.error(error, "USER REGISTERATION SERVICE EXCEPTION");
  }
};

type LoginUser = (data: Partial<users>) => Promise<users | undefined>;

/**
 * @description
 *  LoginUser service checks if the provided user credentials are correct
 *
 * @function verifyPassword util would be used for verifying user password
 * @function prisma API would be used to search user in the databases
 *
 * @param userData user credentials
 * @returns logged in user profile data
 * @example loginUser({email: "mostafafinal55@gmail.com", password: "mostafa-password"})
 */

export const loginUser: LoginUser = async (userData) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (!user) throw new Error("User is not existed");

    const checkPassword = await verifyPassword(
      userData.password as string,
      user.password
    );

    if (!checkPassword) throw new Error("Password's not correct");

    return { ...user, password: "private" };
  } catch (error) {
    logger.error(error, "USER LOGIN SERVICE EXCEPTION");
  }
};

export type ForgetPassword = (userEmail: string) => Promise<void>;

/**
 * @description
 *  ForgetPassword service verifies and sends a reset
 *  password email to the existed user email in order
 *  to reset their password
 *
 * @function prisma API would be used to check the user email
 *                  existance in the database
 * @function generateToken util would be used to generate a jwt
 *                         token to be attached with the reset
 *                         password URL
 * @function resetPasswordEmail util would be used to send reset
 *                              password URL to the user email
 * @param userEmail existed user email
 * @sends a reset password email to the existed user email
 * @example forgetPassword("mostafafinal55@gmail.com")
 */

export const forgetPassword: ForgetPassword = async (userEmail) => {
  try {
    if (!userEmail) throw new Error("user email's not provided");

    const userId = await prisma.users.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!userId) throw new Error("user's not existed!");

    const payload: JwtPayload = userId;
    const secret = ENV_VARS.JWT_SECRET as Secret;
    const options: SignOptions = {
      algorithm: "HS256",
      expiresIn: "5d",
    };

    const token = await generateToken(payload, secret, options);

    const domain: string = `${ENV_VARS.FRONTEND_URL}/user/resetpassword/${token}`;

    await resetPasswordEmail(
      ENV_VARS.EMAIL_SENDER as string,
      userEmail,
      domain
    );
  } catch (error) {
    logger.error(error, "FORGET PASSWORD SERVICE EXCEPTION");
  }
};
