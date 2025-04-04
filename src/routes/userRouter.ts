import { Router } from "express";
import * as controller from "../controllers/userController";
import isAuth from "../middlewares/isAuth";
import { tryCatch } from "../utils/tryCatch";

const userRouter: Router = Router();

userRouter.get("/", isAuth, tryCatch(controller.getUserGet));

userRouter.put(
  "/changepassword",
  isAuth,
  tryCatch(controller.changePasswordPut)
);

userRouter.put("/resetpassword/:token", tryCatch(controller.resetPasswordPut));

userRouter.delete(
  "/deleteaccount",
  isAuth,
  tryCatch(controller.deleteUserDelete)
);

export default userRouter;
