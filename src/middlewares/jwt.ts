import { JwtPayload, sign, SignOptions } from "jsonwebtoken";
import { RegularMiddlewareWithoutNext } from "../types/expressMiddleware";
import { customError } from "../utils/customError";

export const signToken: RegularMiddlewareWithoutNext = async (req, res) => {
  if (!req.user || Object.keys(req.user).length <= 0) throw customError("fail");

  const payload: JwtPayload = {
    id: req.user.id as string,
  };

  const secret = process.env.JWT_SECRET as string;

  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: "1d",
  };

  const token = sign(payload, Buffer.from(secret), options);

  if (!token) throw customError("fail");

  res.cookie("x-auth-token", token, {
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
    sameSite: "none",
    secure: true,
    partitioned: true,
  });

  res.json({ status: "success", message: "successfully logged" });
};
