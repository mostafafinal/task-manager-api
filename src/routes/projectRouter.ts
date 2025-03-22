import { Router } from "express";
import * as projectController from "../controllers/projectController";
import passport from "passport";

const projectRouter: Router = Router();

projectRouter.use(
  (req, res, next) => {
    req.headers.authorization = "Bearer " + req.cookies["x-auth-token"];
    next();
  },
  passport.authenticate("jwt", { session: false })
);

projectRouter.get("/", projectController.getProjects);

projectRouter.post("/", projectController.createProjectPost);

projectRouter.put("/:id", projectController.updateProjectPost);

projectRouter.delete("/:id", projectController.deleteProjectPost);

export default projectRouter;
