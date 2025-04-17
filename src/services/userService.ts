/**
 * @file userService.ts
 * @author Mostafa Hasan // (mostafafinal55@gmail.com)
 * @summary
 *  This file declares a combination of user services
 *  they're responsible for handling user user CRUD operations
 * @version 1.0.0
 * @date 2025-03-30
 * @copyright Copyrights (c) 2025
 */

import { users } from "../types/prisma";
import { prisma } from "../configs/prisma";
import * as bcrypt from "../utils/bcryption";
import { verifyToken } from "../utils/token";
import { JwtPayload, Secret } from "jsonwebtoken";
import { ENV_VARS } from "../configs/envs";
import { logger } from "../utils/logger";

export type GetUserById = (
  userId: users["id"]
) => Promise<Partial<users> | undefined>;

/**
 * @description
 *  GetUserById service retrieves the user data
 * @function prisma API would be used for searching the user in the database
 * @param userId for retrieving the user data
 * @returns  user data
 * @example getUserById("user-id")
 */

export const getUserById: GetUserById = async (userId) => {
  try {
    if (!userId) throw Error("user id's not provided");

    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: { firstName: true, lastName: true, email: true },
    });

    if (!user) throw Error("user's not found");

    return user;
  } catch (error) {
    logger.error(error, "GET USER BY ID SERVICE EXCEPTION");
  }
};

export type ChangeUserPassword = (
  userId: users["id"],
  oldPassword: users["password"],
  newPassword: users["password"]
) => Promise<boolean | undefined>;

/**
 * @description
 *  ChangeUserPassword service changes user credentials
 * @function prisma APIs would be used for searching & updating user credentials in the database
 * @function bcryption utils would be used for verifying the current password
 *                     and hashes the new password
 * @param userId for detemine which user to update its credentials
 * @param oldPassword to be changed
 * @param newPassword to be replaced with the old one
 * @returns  truthy result
 * @example changeUserPassword("user-id", "user-old-password", "user-new-password")
 */

export const changeUserPassword: ChangeUserPassword = async (
  userId,
  oldPassword,
  newPassword
) => {
  try {
    if (!userId || !oldPassword || !newPassword)
      throw new Error("either user id or old/new password is not provided");

    const currUser = await prisma.users.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (
      !(await bcrypt.verifyPassword(oldPassword, currUser?.password as string))
    )
      throw new Error("current password's incorrect!");

    const newHashedPassword = await bcrypt.hashPassword(newPassword);

    if (!newHashedPassword) throw new Error("valied to hash new password");

    if (await bcrypt.verifyPassword(newPassword, currUser?.password as string))
      throw new Error("user password's already the same!");

    const user = await prisma.users.update({
      data: { password: newHashedPassword, v: { increment: 1 } },
      where: { id: userId },
    });

    if (!user) throw new Error("failed to change user password!");

    return true;
  } catch (error) {
    logger.error(error, "CHANGE USER PASSWORD SERVICE EXCEPTION");
  }
};

export type ResetUserPassword = (
  token: string,
  newPassword: users["password"]
) => Promise<boolean | undefined>;

/**
 * @description
 *  ResetUserPassword service reset user credentials
 * @function verifyToken util would be used to verify the provided token
 * @function bcryption verifyPassword util would be used for hashing the provided password
 * @function prisma APIs would be used for updating user credentials in the database
 * @param token for verifying current user authorized to reset password
 * @param newPassword to be replaced with the old one
 * @returns  truthy result
 * @example resetUserPassword("provided.token.string", "user-new-password")
 */

export const resetUserPassword: ResetUserPassword = async (
  token,
  newPassword
) => {
  try {
    if (!token || !newPassword)
      throw new Error("either token or new password is not provided");

    const payload = (await verifyToken(
      token,
      ENV_VARS.JWT_SECRET as Secret
    )) as unknown as JwtPayload;

    if (!payload) throw new Error("invalid token");

    const hashedPassword = await bcrypt.hashPassword(newPassword);

    const user = await prisma.users.update({
      data: { password: hashedPassword, v: { increment: 1 } },
      where: { id: payload.id },
    });

    if (!user) throw new Error("failed to reset user password!");

    return true;
  } catch (error) {
    logger.error(error, "RESET USER PASSWORD SERVICE EXCEPTION");
  }
};

/**
 * @description
 *  DeleteUserById service deletes the user account data
 * @function prisma API would be used for deleting the user from the database
 * @param userId for deleting the user data
 * @returns  truthy
 * @example deleteUserById("user-id")
 */

export type DeleteUserById = (
  userId: users["id"]
) => Promise<boolean | undefined>;

export const deleteUserById: DeleteUserById = async (userId) => {
  try {
    if (!userId) throw new Error("user id's not provided");

    const user = await prisma.users.delete({ where: { id: userId } });

    if (!user) throw new Error("failed to delete user!");

    return true;
  } catch (error) {
    logger.error(error, "DELETE USER BY ID SERVICE EXCEPTION");
  }
};
