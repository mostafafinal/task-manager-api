import { users } from "../types/prisma";
import { prisma } from "../configs/prisma";
import * as bcrypt from "../utils/bcryption";
import { verifyToken } from "../utils/token";
import { JwtPayload, Secret } from "jsonwebtoken";
import { ENV_VARS } from "../configs/envs";

export type GetUserById = (
  userId: string
) => Promise<Partial<users> | undefined>;

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
    console.error(error);
  }
};

export type ChangeUserPassword = (
  userId: string,
  oldPassword: string,
  newPassword: string
) => Promise<boolean | undefined>;

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

    const newHashedPassword: string = await bcrypt.hashPassword(newPassword);

    if (await bcrypt.verifyPassword(newPassword, currUser?.password as string))
      throw new Error("user password's already the same!");

    const user = await prisma.users.update({
      data: { password: newHashedPassword, v: { increment: 1 } },
      where: { id: userId },
    });

    if (!user) throw new Error("failed to change user password!");

    return true;
  } catch (error) {
    console.error(error);
  }
};

export type ResetUserPassword = (
  token: string,
  newPassword: string
) => Promise<boolean | undefined>;

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
    console.error(error);
  }
};

export type DeleteUserById = (userId: string) => Promise<boolean | undefined>;

export const deleteUserById: DeleteUserById = async (userId) => {
  try {
    if (!userId) throw new Error("user id's not provided");

    const user = await prisma.users.delete({ where: { id: userId } });

    if (!user) throw new Error("failed to delete user!");

    return true;
  } catch (error) {
    console.error(error);
  }
};
