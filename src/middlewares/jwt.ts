import { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { RegularMiddlewareWithoutNext } from "../types/expressMiddleware";
import { customError } from "../utils/customError";
import { matchedData, validationResult } from "express-validator";
import { generateToken } from "../utils/token";

export const assignToken: RegularMiddlewareWithoutNext = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("fail", 400, errors.array()[0].msg);

  const userId = matchedData(req).userId;

  const payload: JwtPayload = {
    id: userId,
  };
  const secret = process.env.JWT_SECRET as Secret;
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: "1d",
  };

  const token = await generateToken(payload, secret, options);

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
