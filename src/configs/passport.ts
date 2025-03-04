import passport from "passport";
import { IStrategyOptions, Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt, VerifyCallback, StrategyOptions } from "passport-jwt";
import { User } from "../models/User";
import { loginUser } from "../services/authService";

const localOpts: IStrategyOptions = {
    usernameField: "email",
}

const verifyUserCredientials: VerifyFunction = async (username, password, done) => {
    try {
        const user = await loginUser({email: username, password: password});

        if (!user) {
            return done(null, false, { message: "Incorrect email or password" });
        }

        return done(null, user);
    } catch (err) {
        console.error(err);
    }
};

const localStrategy: LocalStrategy = new LocalStrategy(localOpts, verifyUserCredientials);

const jwtOpts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string,
}

const verifyUserFromToken: VerifyCallback = async (payload, done) => {
    try {
        const user = await User.findOne(payload.sub);

        if(!user) return done(null, false);

        return done(null, user)
    } catch (error) {
        return done(error, false);
    }
}

const jwtStrategy: JwtStrategy = new JwtStrategy(jwtOpts, verifyUserFromToken);

passport.use(localStrategy);
passport.use(jwtStrategy);