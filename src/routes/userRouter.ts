import { Router } from "express";
import * as controller from "../controllers/userController";
import isAuth from "../middlewares/isAuth";

const userRouter: Router = Router();

userRouter.use(isAuth);

userRouter.get("/", controller.getUserGet);

userRouter.delete("/deleteaccount", controller.deleteUserDelete);

export default userRouter;
