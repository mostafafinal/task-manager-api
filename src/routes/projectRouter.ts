import { Router } from "express";
import * as projectController from "../controllers/projectController";
import isAuth from "../middlewares/isAuth";

const projectRouter: Router = Router();

projectRouter.use(isAuth);

projectRouter
  .route("/")
  .get(projectController.getProjects)
  .post(projectController.createProjectPost);

projectRouter
  .route("/:id")
  .get(projectController.getProject)
  .put(projectController.updateProjectPost)
  .delete(projectController.deleteProjectPost);

export default projectRouter;
