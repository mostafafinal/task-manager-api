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
import { prisma } from "./prisma";
import { ENV_VARS } from "./envs";

const googleOpts: StrategyOptions = {
  clientID: ENV_VARS.GOOGLE_CLIENT_ID as string,
  clientSecret: ENV_VARS.GOOGLE_CLIENT_SECRET as string,
  callbackURL: ENV_VARS.GOOGLE_CB_URL as string,
};

const googleVerifyCallback: GoogleVerifyCB = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    if (!profile.email)
      throw new Error("email's not provided from the profile!");

    const user = await prisma.users.upsert({
      where: { email: profile.email },
      create: {
        firstName: profile.given_name,
        lastName: profile.family_name,
        email: profile.email,
        password: profile.sub,
      },
      update: {},
    });

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

const localVerifyCallback: VerifyFunction = async (
  username,
  password,
  done
) => {
  try {
    if (!username || !password)
      throw new Error("email or password is not provided");

    const user = await loginUser({ email: username, password: password });

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const localStrategy: LocalStrategy = new LocalStrategy(
  localOpts,
  localVerifyCallback
);

const jwtOpts: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ENV_VARS.JWT_SECRET as string,
};

const jwtVerifyUserCallback: VerifyCallback = async (payload, done) => {
  try {
    if (!payload.id || payload.id.length !== 24) return done(null, false);

    const user = await prisma.users.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user) return done(null, false);

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

const jwtStrategy: JwtStrategy = new JwtStrategy(
  jwtOpts,
  jwtVerifyUserCallback
);

passport.use(localStrategy);
passport.use(googleStrategy);
passport.use(jwtStrategy);
