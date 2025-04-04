import { Types } from "mongoose";
import { IUser } from "../types/schemas";
import { User } from "../models/User";
import * as bcrypt from "../utils/bcryption";
import agenda from "../configs/agenda";
import { verifyToken } from "../utils/token";
import { JwtPayload, Secret } from "jsonwebtoken";

export const getUserById = async (
  userId: Types.ObjectId
): Promise<Partial<IUser> | undefined> => {
  try {
    if (!userId) throw Error("service: user id's not provided");

    const user: Partial<IUser> | null = await User.findById({
      _id: userId,
    }).select(["firstName", "lastName", "email"]);

    if (!user) throw Error("service: user's not found");

    return user;
  } catch (error) {
    console.error(error);
  }
};

export const changeUserPassword = async (
  userId: Types.ObjectId,
  oldPassword: string,
  newPassword: string
): Promise<boolean | undefined> => {
  try {
    if (!userId || !oldPassword || !newPassword)
      throw new Error("either user id or old/new password is not provided");

    const userPassword: Partial<IUser> | null =
      await User.findById(userId).select("password");

    if (!(await bcrypt.verifyPassword(oldPassword, userPassword as string)))
      throw new Error("current password's incorrect!");

    const newHashedPassword: string = await bcrypt.hashPassword(newPassword);

    if (await bcrypt.verifyPassword(newPassword, userPassword as string))
      throw new Error("user password's already the same!");

    const result = await User.updateOne(
      { _id: userId },
      { password: newHashedPassword }
    );

    return result.acknowledged;
  } catch (error) {
    console.error(error);
  }
};

export const resetUserPassword = async (
  token: string,
  newPassword: string
): Promise<boolean | undefined> => {
  try {
    if (!token || !newPassword)
      throw new Error("either token or new password is not provided");

    const payload = (await verifyToken(
      token,
      process.env.JWT_SECRET as Secret
    )) as unknown as JwtPayload;

    if (!payload) throw new Error("invalid token");

    const hashedPassword = await bcrypt.hashPassword(newPassword);

    const result = await User.updateOne(
      { _id: payload.id },
      { password: hashedPassword }
    );

    return result.acknowledged;
  } catch (error) {
    console.error(error);
  }
};

export const deleteUserById = async (
  userId: Types.ObjectId
): Promise<boolean | undefined> => {
  try {
    if (!userId) throw new Error("service: user id's not provided");

    const result = await User.deleteOne({ _id: userId });

    agenda.now("delete user projects", userId);
    agenda.now("delete user tasks", userId);

    return result.acknowledged;
  } catch (error) {
    console.error(error);
  }
};
