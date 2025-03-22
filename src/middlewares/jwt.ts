import { JwtPayload, sign, SignOptions } from "jsonwebtoken";
import { RegularMiddleware } from "../types/expressMiddleware";

export const signToken: RegularMiddleware = async (req, res, next) => {
  try {
    if (!req.user) throw new Error("user data're not found");

    const payload: JwtPayload = {
      id: req.user.id as string,
    };

    const secret = process.env.JWT_SECRET as string;

    const options: SignOptions = {
      algorithm: "HS256",
      expiresIn: "1d",
    };

    const token = sign(payload, Buffer.from(secret), options);

    res.cookie("x-auth-token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: true,
    });
    res.cookie("userId", payload.id, {
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: true,
    });

    res.json({ status: "success", message: "successfully logged" });
  } catch (err) {
    next(err);
  }
};
