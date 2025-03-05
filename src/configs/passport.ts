import passport from "passport";
import {
  IStrategyOptions,
  Strategy as LocalStrategy,
  VerifyFunction,
} from "passport-local";
import passportCustom, { VerifiedCallback } from "passport-custom";
import { loginUser } from "../services/authService";
import { Request } from "express";
import { jwtVerify } from "jose";
import { User } from "../models/User";

const localOpts: IStrategyOptions = {
  usernameField: "email",
};

const verifyUserCredientials: VerifyFunction = async (
  username,
  password,
  done,
) => {
  try {
    const user = await loginUser({ email: username, password: password });

    if (!user) {
      return done(null, false, { message: "Incorrect email or password" });
    }

    return done(null, user);
  } catch (err) {
    console.error(err);
  }
};

const localStrategy: LocalStrategy = new LocalStrategy(
  localOpts,
  verifyUserCredientials,
);

const CustomStrategy = passportCustom.Strategy;

const getTokenFromHeader = (request: Request): string | null => {
  const authHeader = request.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer "))
    return authHeader.split(" ")[1];

  return null;
};

const joseVerifyCallback: VerifiedCallback = async (request, done) => {
  try {
    const token = getTokenFromHeader(request);

    if (!token) return done(new Error("Missing token"), false);

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey);

    const user = await User.findOne({ email: payload.email });

    if (!user) return done(null, false);

    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

const JoseStrategy = new CustomStrategy(joseVerifyCallback);

passport.use(localStrategy);
passport.use("jose", JoseStrategy);
