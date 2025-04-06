import { Router } from "express";
import * as controller from "../controllers/authController";
import isAuth from "../middlewares/isAuth";
import { tryCatch } from "../utils/tryCatch";
import { signToken } from "../middlewares/jwt";
import * as validate from "../validators/authValidator";

const authRouter: Router = Router();

authRouter.post("/register", validate.signUp, tryCatch(controller.signUp));

authRouter.post(
  "/login",
  validate.login,
  controller.loginLocal,
  tryCatch(signToken)
);

authRouter.get("/google", controller.loginGoogle);

authRouter.get(
  "/google/callback",
  controller.loginGoogleCB,
  tryCatch(signToken)
);

authRouter.post(
  "/forgetpassword",
  validate.email,
  tryCatch(controller.forgetPasswordPost)
);

authRouter.delete("/logout", isAuth, tryCatch(controller.logout));

export default authRouter;
