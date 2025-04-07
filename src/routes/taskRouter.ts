import { Router } from "express";
import * as controller from "../controllers/taskController";
import isAuth from "../middlewares/isAuth";
import { tryCatch } from "../utils/tryCatch";
import * as validate from "../validators/taskValidator";

const taskRouter: Router = Router();

taskRouter.use(isAuth);

taskRouter
  .route("/")
  .post(validate.newtask, tryCatch(controller.createTaskPost));

taskRouter
  .route("/:id")
  .get(validate.paramId, tryCatch(controller.getTaskGet))
  .put(validate.paramId, validate.newData, tryCatch(controller.updateTaskPost))
  .delete(validate.paramId, tryCatch(controller.deleteTaskPost));

export default taskRouter;
