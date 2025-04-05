import { Router } from "express";
import * as authController from "../controllers/authController";
import isAuth from "../middlewares/isAuth";
import { tryCatch } from "../utils/tryCatch";
import { signToken } from "../middlewares/jwt";

const authRouter: Router = Router();

authRouter.post("/register", tryCatch(authController.signUp));

authRouter.post("/login", authController.loginLocal, tryCatch(signToken));

authRouter.get("/google", authController.loginGoogle);

authRouter.get(
  "/google/callback",
  authController.loginGoogleCB,
  tryCatch(signToken)
);

authRouter.post("/forgetpassword", authController.forgetPasswordPost);

authRouter.delete("/logout", isAuth, tryCatch(authController.logout));

export default authRouter;
