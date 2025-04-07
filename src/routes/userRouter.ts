import { Router } from "express";
import * as controller from "../controllers/userController";
import isAuth from "../middlewares/isAuth";
import { tryCatch } from "../utils/tryCatch";
import * as validate from "../validators/userValidator";

const userRouter: Router = Router();

userRouter.get("/", isAuth, tryCatch(controller.getUserGet));

userRouter.put(
  "/changepassword",
  isAuth,
  validate.passwords,
  tryCatch(controller.changePasswordPut)
);

userRouter.put(
  "/resetpassword/:token",
  validate.credentials,
  tryCatch(controller.resetPasswordPut)
);

userRouter.delete(
  "/deleteaccount",
  isAuth,
  tryCatch(controller.deleteUserDelete)
);

export default userRouter;
