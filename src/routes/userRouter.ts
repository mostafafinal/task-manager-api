import { Router } from "express";
import * as controller from "../controllers/userController";
import isAuth from "../middlewares/isAuth";

const userRouter: Router = Router();

userRouter.get("/", isAuth, controller.getUserGet);

userRouter.put("/changepassword", isAuth, controller.changePasswordPut);

userRouter.put("/resetpassword/:token", controller.resetPasswordPut);

userRouter.delete("/deleteaccount", isAuth, controller.deleteUserDelete);

export default userRouter;
