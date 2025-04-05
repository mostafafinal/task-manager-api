import { Router } from "express";
import * as controller from "../controllers/taskController";
import isAuth from "../middlewares/isAuth";
import { tryCatch } from "../utils/tryCatch";

const taskRouter: Router = Router();

taskRouter.use(isAuth);

taskRouter.route("/").post(tryCatch(controller.createTaskPost));

taskRouter
  .route("/:id")
  .get(tryCatch(controller.getTaskGet))
  .put(tryCatch(controller.updateTaskPost))
  .delete(tryCatch(controller.deleteTaskPost));

export default taskRouter;
