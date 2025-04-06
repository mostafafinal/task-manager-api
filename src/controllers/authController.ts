import * as authService from "../services/authService";
import {
  RegularMiddleware,
  RegularMiddlewareWithoutNext,
} from "../types/expressMiddleware";
import passport, { AuthenticateCallback } from "passport";
import { IUser } from "../types/schemas";
import { NextFunction, Request, Response } from "express";
import { HydratedDocument } from "mongoose";
import { customError } from "../utils/customError";
import { matchedData, validationResult } from "express-validator";

export const signUp: RegularMiddlewareWithoutNext = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("fail", 400, errors.array()[0].msg);

  const data = matchedData(req);
  delete data.confirmPassword;

  const result = await authService.registerUser({ ...data } as IUser);

  if (!result) throw customError("fail", 500, "failed to register!");

  res.status(201).json({
    status: "success",
    message: "registered successfully!",
  });
};

export const loginLocal: RegularMiddleware[] = [
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      next(customError("fail", 400, errors.array()[0].msg));

    next();
  },
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", { session: false }, function (err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next(customError("fail", 400, "incorrect email or password"));
      }

      req.user = user as HydratedDocument<IUser>;

      next();
    } as AuthenticateCallback)(req, res, next);
  },
];

export const loginGoogle: RegularMiddleware[] = [
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  }),
];

export const loginGoogleCB: RegularMiddleware = passport.authenticate(
  "google",
  {
    failureRedirect: "/",
    session: false,
  }
);

export const forgetPasswordPost: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("fail", 400, errors.array()[0].msg);

  const email: string = matchedData(req).email;

  await authService.forgetPassword(email);

  res.status(200).json({
    status: "success",
    message: "we've sent a reset password email to you!",
  });
};

export const logout: RegularMiddlewareWithoutNext = async (req, res) => {
  req.user = {} as HydratedDocument<IUser>;

  res
    .status(204)
    .clearCookie("x-auth-token", { maxAge: 0, sameSite: "strict" })
    .end();
};
