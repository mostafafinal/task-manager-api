import { Router } from "express";
import * as projectController from "../controllers/projectController";
import isAuth from "../middlewares/isAuth";

const projectRouter: Router = Router();

projectRouter.use(isAuth);

projectRouter.get("/", projectController.getProjects);

projectRouter.get("/:id", projectController.getProject);

projectRouter.post("/", projectController.createProjectPost);

projectRouter.put("/:id", projectController.updateProjectPost);

projectRouter.delete("/:id", projectController.deleteProjectPost);

export default projectRouter;
