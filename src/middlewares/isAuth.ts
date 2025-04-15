import passport from "passport";
import { RegularMiddleware } from "../types/expressMiddleware";
import { customError } from "../utils/customError";

const isAuth: RegularMiddleware[] = [
  (req, res, next) => {
    if (!req.cookies["x-auth-token"])
      throw next(customError("info", 401, "you're not authorized!"));

    req.headers.authorization = "Bearer " + req.cookies["x-auth-token"];

    next();
  },
  passport.authenticate("jwt", { session: false }),
];

export default isAuth;
