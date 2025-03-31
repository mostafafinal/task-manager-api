import { Router } from "express";
import * as authController from "../controllers/authController";

const authRouter: Router = Router();

authRouter.post("/register", authController.signUp);

authRouter.post("/login", authController.loginLocal);

authRouter.get("/google", authController.loginGoogle);

authRouter.get("/google/callback", authController.loginGoogleCB);

authRouter.post("/forgetpassword", authController.forgetPasswordPost);

authRouter.delete("/logout", ...authController.logout);

export default authRouter;
