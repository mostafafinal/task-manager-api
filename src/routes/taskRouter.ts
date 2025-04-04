import { Router } from "express";
import * as taskController from "../controllers/taskController";
import isAuth from "../middlewares/isAuth";

const taskRouter: Router = Router();

taskRouter.use(isAuth);

taskRouter.route("/").post(taskController.createTaskPost);

taskRouter
  .route("/:id")
  .get(taskController.getTaskGet)
  .put(taskController.updateTaskPost)
  .delete(taskController.deleteTaskPost);

export default taskRouter;
