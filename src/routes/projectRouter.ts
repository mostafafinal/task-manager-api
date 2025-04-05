import { Router } from "express";
import * as projectController from "../controllers/projectController";
import isAuth from "../middlewares/isAuth";
import { tryCatch } from "../utils/tryCatch";

const projectRouter: Router = Router();

projectRouter.use(isAuth);

projectRouter
  .route("/")
  .get(tryCatch(projectController.getProjects))
  .post(tryCatch(projectController.createProjectPost));

projectRouter
  .route("/:id")
  .get(tryCatch(projectController.getProject))
  .put(tryCatch(projectController.updateProjectPost))
  .delete(tryCatch(projectController.deleteProjectPost));

export default projectRouter;
