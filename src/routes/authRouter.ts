import { Router } from "express";
import * as controller from "../controllers/authController";
import isAuth from "../middlewares/isAuth";
import { tryCatch } from "../utils/tryCatch";
import { assignToken } from "../middlewares/jwt";
import * as validate from "../validators/authValidator";
import { validateUserId } from "../validators/objectIdValidator";

const authRouter: Router = Router();

authRouter.post("/register", validate.signUp, tryCatch(controller.signUp));

authRouter.post(
  "/login",
  validate.login,
  controller.loginLocal,
  validateUserId,
  tryCatch(assignToken)
);

authRouter.get("/google", controller.loginGoogle);

authRouter.get(
  "/google/callback",
  controller.loginGoogleCB,
  tryCatch(assignToken)
);

authRouter.post(
  "/forgetpassword",
  validate.email,
  tryCatch(controller.forgetPasswordPost)
);

authRouter.delete(
  "/logout",
  isAuth,
  validateUserId,
  tryCatch(controller.logout)
);

export default authRouter;
