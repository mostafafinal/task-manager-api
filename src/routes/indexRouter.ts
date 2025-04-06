import { Router } from "express";
import * as controller from "../controllers/indexController";
import authRouter from "./authRouter";
import projectRouter from "./projectRouter";
import taskRouter from "./taskRouter";
import userRouter from "./userRouter";
import { tryCatch } from "../utils/tryCatch";

const indexRouter = Router();

indexRouter.get("/", tryCatch(controller.greeting));

indexRouter.use("/auth", authRouter);
indexRouter.use("/projects", projectRouter);
indexRouter.use("/tasks", taskRouter);
indexRouter.use("/user", userRouter);

indexRouter.all("*", tryCatch(controller.notFound));

export default indexRouter;
