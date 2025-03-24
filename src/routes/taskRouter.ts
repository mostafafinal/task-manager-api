import { Router } from "express";
import * as taskController from "../controllers/taskController";
import isAuth from "../middlewares/isAuth";

const taskRouter: Router = Router();

taskRouter.use(isAuth);

taskRouter.post("/", taskController.createTaskPost);

taskRouter.get("/:id", taskController.getTaskGet);

taskRouter.put("/:id", taskController.updateTaskPost);

taskRouter.delete("/:id", taskController.deleteTaskPost);

export default taskRouter;
