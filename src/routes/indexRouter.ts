import { Router } from "express";
import * as controller from "../controllers/indexController";
import authRouter from "./authRouter";
import projectRouter from "./projectRouter";
import taskRouter from "./taskRouter";
import userRouter from "./userRouter";
import insightsRouter from "./insightsRouter";
import { tryCatch } from "../utils/tryCatch";

const indexRouter = Router();

indexRouter.get("/", tryCatch(controller.launch));

indexRouter.use("/auth", authRouter);
indexRouter.use("/projects", projectRouter);
indexRouter.use("/tasks", taskRouter);
indexRouter.use("/user", userRouter);
indexRouter.use("/insights", insightsRouter);

indexRouter.all("*", tryCatch(controller.notFound));

export default indexRouter;
