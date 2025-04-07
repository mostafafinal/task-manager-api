import { Router } from "express";
import * as controller from "../controllers/projectController";
import isAuth from "../middlewares/isAuth";
import { tryCatch } from "../utils/tryCatch";
import * as validate from "../validators/projectValidator";

const projectRouter: Router = Router();

projectRouter.use(isAuth);

projectRouter
  .route("/")
  .get(validate.pagination, tryCatch(controller.getProjects))
  .post(validate.newProject, tryCatch(controller.createProjectPost));

projectRouter
  .route("/:id")
  .get(validate.paramId, tryCatch(controller.getProject))
  .put(
    validate.paramId,
    validate.newData,
    tryCatch(controller.updateProjectPost)
  )
  .delete(validate.paramId, tryCatch(controller.deleteProjectPost));

export default projectRouter;
