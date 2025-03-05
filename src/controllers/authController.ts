import * as authService from "../services/authService";
import { IUser } from "../types/schemas";
import { RegularMiddleware } from "../types/expressMiddleware";

export const signUp: RegularMiddleware = async (req, res, next) => {
  try {
    const data: IUser = req.body;

    const user = await authService.registerUser({ ...data });

    if (!user) throw new Error("regiseration failed");

    res.status(200).json({ status: "success", user: { ...user } });
  } catch (error) {
    console.error(error);
    res.status(401).json({ status: "failed" });

    next(error);
  }
};
