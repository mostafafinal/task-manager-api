import passport from "passport";
import { IStrategyOptions, Strategy as LocalStrategy, Strategy, VerifyFunction } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt, VerifyCallback, StrategyOptions } from "passport-jwt";
import { User } from "../models/User";
import { verifyPassword } from "../utils/bcryption";

const localOpts: IStrategyOptions = {
    usernameField: "email",
}

const verifyUserCredientials: VerifyFunction = async (username, password, done) => {
    try {
        const user = await User.getUser(username);

        if (!user) {
            return done(null, false, { message: "Incorrect email or password" });
        }

        if (!(await verifyPassword(password, user.password))) {
            return done(null, false, { message: "Incorrect email or password" });
        }

        return done(null, user);
    } catch (err) {
        console.error(err);
    }
};

const localStrategy: Strategy = new LocalStrategy(localOpts, verifyUserCredientials);

const jwtOpts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRECT as string,
}

const verifyUserToken: VerifyCallback = async (payload, done) => {
    try {
        const user = await User.findById(payload._id);

        if(!user) return done(null, false);

        return done(null, user)
    } catch (error) {
        return done(error, false);
    }
}

const jwtStrategy: JwtStrategy = new JwtStrategy(jwtOpts, verifyUserToken);

passport.use(localStrategy);
passport.use(jwtStrategy);