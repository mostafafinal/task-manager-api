import { Router } from "express";
import * as controller from "../controllers/taskController";
import isAuth from "../middlewares/isAuth";
import { tryCatch } from "../utils/tryCatch";
import * as validate from "../validators/taskValidator";
import * as objectId from "../validators/objectIdValidator";

const taskRouter: Router = Router();

taskRouter.use(isAuth, objectId.validateUserId);

taskRouter
  .route("/")
  .post(validate.newtask, tryCatch(controller.createTaskPost));

taskRouter
  .route("/:id")
  .get(objectId.validateParamId, tryCatch(controller.getTaskGet))
  .put(
    objectId.validateParamId,
    validate.newData,
    tryCatch(controller.updateTaskPost)
  )
  .delete(objectId.validateParamId, tryCatch(controller.deleteTaskPost));

export default taskRouter;
