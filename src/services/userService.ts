import { Types } from "mongoose";
import { IUser } from "../types/schemas";
import { User } from "../models/User";

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
