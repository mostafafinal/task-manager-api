import { Router } from "express";
import * as controller from "../controllers/projectController";
import isAuth from "../middlewares/isAuth";
import { tryCatch } from "../utils/tryCatch";
import * as validate from "../validators/projectValidator";
import * as objectId from "../validators/objectIdValidator";

const projectRouter: Router = Router();

projectRouter.use(isAuth, objectId.validateUserId);

projectRouter
  .route("/")
  .get(validate.pagination, tryCatch(controller.getProjects))
  .post(validate.newProject, tryCatch(controller.createProjectPost));

projectRouter
  .route("/:id")
  .get(objectId.validateParamId, tryCatch(controller.getProject))
  .put(
    objectId.validateParamId,
    validate.newData,
    tryCatch(controller.updateProjectPost)
  )
  .delete(objectId.validateParamId, tryCatch(controller.deleteProjectPost));

export default projectRouter;
