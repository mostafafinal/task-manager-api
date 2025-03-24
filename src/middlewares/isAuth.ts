import passport from "passport";
import { RegularMiddleware } from "../types/expressMiddleware";

const isAuth: RegularMiddleware[] = [
  (req, res, next) => {
    req.headers.authorization = "Bearer " + req.cookies["x-auth-token"];
    next();
  },
  passport.authenticate("jwt", { session: false }),
];

export default isAuth;
