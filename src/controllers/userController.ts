import { RegularMiddleware } from "../types/expressMiddleware";
import { IUser } from "../types/schemas";
import * as service from "../services/userService";
import { Types } from "mongoose";
import { ObjectId } from "mongodb";

export const getUserGet: RegularMiddleware = async (req, res, next) => {
  try {
    if (!req.user?.id)
      throw new Error("user credentials are not existed in the request!");

    const id: Types.ObjectId = ObjectId.createFromHexString(req.user?.id);

    const user: Partial<IUser> | undefined = await service.getUserById(id);

    if (!user)
      res.status(404).json({ status: "fail", message: "user not found!" });

    res.status(200).json({ user: user });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
