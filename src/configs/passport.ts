import passport from "passport";
import {
  IStrategyOptions,
  Strategy as LocalStrategy,
  VerifyFunction,
} from "passport-local";
import {
  Strategy as GoogleStrategy,
  StrategyOptions,
  VerifyFunction as GoogleVerifyCB,
} from "passport-google-oauth2";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  VerifyCallback,
  StrategyOptionsWithoutRequest,
} from "passport-jwt";
import { loginUser } from "../services/authService";
import { User } from "../models/User";
import dotenv from "dotenv";
import { IUser } from "../types/schemas";

dotenv.config();

const googleOpts: StrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: process.env.GOOGLE_CB_URL as string,
};

const googleVerifyCallback: GoogleVerifyCB = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    const user = await User.findOne({ email: profile.email });

    if (!user) {
      const newUser = await User.create<IUser>({
        firstName: profile.given_name,
        lastName: profile.family_name,
        email: profile.email,
        password: profile.sub,
      });

      return done(null, newUser);
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const googleStrategy: GoogleStrategy = new GoogleStrategy(
  googleOpts,
  googleVerifyCallback
);

const localOpts: IStrategyOptions = {
  usernameField: "email",
};

const verifyUserCredientials: VerifyFunction = async (
  username,
  password,
  done
) => {
  try {
    const user = await loginUser({ email: username, password: password });

    if (!user) {
      return done(null, false, {
        message: "Incorrect email or password",
      });
    }

    return done(null, user);
  } catch (err) {
    console.error(err);
  }
};

const localStrategy: LocalStrategy = new LocalStrategy(
  localOpts,
  verifyUserCredientials
);

const jwtOpts: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

const verifyUserFromToken: VerifyCallback = async (payload, done) => {
  try {
    const user = await User.findOne({ _id: payload.id });

    if (!user) return done(null, false);

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

const jwtStrategy: JwtStrategy = new JwtStrategy(jwtOpts, verifyUserFromToken);

passport.use(localStrategy);
passport.use(googleStrategy);
passport.use(jwtStrategy);
