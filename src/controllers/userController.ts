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

    res.status(200).json({ user: user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ status: "fail", message: error.message });

      return;
    }

    next(error);
  }
};

export const changePasswordPut: RegularMiddleware = async (req, res, next) => {
  try {
    if (!req.user?.id)
      throw new Error("user credentials are not existed in the request!");
    if (!req.body.oldPassword || !req.body.newPassword)
      throw new Error("either new/old password is not provided!");

    const id: Types.ObjectId = ObjectId.createFromHexString(req.user?.id);

    await service.changeUserPassword(
      id,
      req.body.oldPassword,
      req.body.newPassword
    );

    res
      .status(201)
      .json({
        status: "success",
        message: "Your password's been changed successfully!",
      });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ status: "fail", message: error.message });

      return;
    }

    next(error);
  }
};

export const deleteUserDelete: RegularMiddleware = async (req, res, next) => {
  try {
    if (!req.user?.id)
      throw new Error("user credentials are not existed in the request!");

    const id: Types.ObjectId = ObjectId.createFromHexString(req.user?.id);

    await service.deleteUserById(id);

    res.status(204).json({
      status: "success",
      message: "your account's been deleted permanently!",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ status: "fail", message: error.message });

      return;
    }

    next(error);
  }
};
