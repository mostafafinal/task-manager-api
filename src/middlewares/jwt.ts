import { JwtPayload, sign, SignOptions } from "jsonwebtoken";
import { RegularMiddleware } from "../types/expressMiddleware";

export const signToken: RegularMiddleware = async (req, res, next) => {
  try {
    if (!req.user) throw new Error("user data're not found");

    const payload: JwtPayload = {
      email: req.user?.email as string,
    };

    const secret = process.env.JWT_SECRET as string;

    const options: SignOptions = {
      algorithm: "HS256",
      expiresIn: "1d",
    };

    const token = sign(payload, Buffer.from(secret), options);

    res.json({ token });
  } catch (err) {
    next(err);
  }
};
