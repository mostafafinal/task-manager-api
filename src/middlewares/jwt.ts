import { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { RegularMiddleware } from "../types/expressMiddleware";
import { customError } from "../utils/customError";
import { matchedData, validationResult } from "express-validator";
import { generateToken } from "../utils/token";
import { ENV_VARS } from "../configs/envs";

export const assignToken: RegularMiddleware = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("error", 400, errors.array()[0].msg);

  const userId = matchedData(req).userId;

  const payload: JwtPayload = {
    id: userId,
  };
  const secret = ENV_VARS.JWT_SECRET as Secret;
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: "1d",
  };

  const token = await generateToken(payload, secret, options);

  if (!token) throw customError("fatal");

  res.cookie("x-auth-token", token, {
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
    sameSite: "none",
    secure: true,
    partitioned: true,
  });

  next();
};
