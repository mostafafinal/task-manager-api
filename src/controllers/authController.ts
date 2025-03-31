import * as authService from "../services/authService";
import { RegularMiddleware } from "../types/expressMiddleware";
import passport, { AuthenticateCallback } from "passport";
import { signToken } from "../middlewares/jwt";
import { IUser } from "../types/schemas";
import { NextFunction, Request, Response } from "express";
import { HydratedDocument } from "mongoose";
import isAuth from "../middlewares/isAuth";

export const signUp: RegularMiddleware = async (req, res, next) => {
  try {
    const data: IUser = req.body;

    await authService.registerUser({ ...data });

    res.status(201).json({
      status: "success",
      message: "registered successfully!",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ status: "fail", message: error.message });

      return;
    }

    next(error);
  }
};

export const loginLocal = [
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", { session: false }, function (
      err,
      user,
      info
    ) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({ status: "fail", ...(info as object) });
      }

      req.user = user as HydratedDocument<IUser>;

      next();
    } as AuthenticateCallback)(req, res, next);
  },
  signToken,
];

export const loginGoogle: RegularMiddleware[] = [
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  }),
];

export const loginGoogleCB: RegularMiddleware[] = [
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  signToken,
];

export const forgetPasswordPost: RegularMiddleware = async (req, res, next) => {
  try {
    if (!req.body.email) throw new Error("user email's not provided");

    await authService.forgetPassword(req.body.email);

    res.status(204).json({
      status: "success",
      message: "we've sent a reset password email to you!",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ status: "fail", message: error.message });

      return;
    }

    next(error);
  }
};

export const logout: [RegularMiddleware[], RegularMiddleware] = [
  isAuth,
  async (req, res, next) => {
    try {
      req.user = {} as HydratedDocument<IUser>;

      res
        .status(204)
        .clearCookie("x-auth-token", { maxAge: 0, sameSite: "strict" })
        .end();
    } catch (error) {
      next(error);
    }
  },
];
