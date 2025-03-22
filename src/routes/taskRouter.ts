import { Router } from "express";
import * as taskController from "../controllers/taskController";
import passport from "passport";

const taskRouter: Router = Router();

taskRouter.use(
  (req, res, next) => {
    req.headers.authorization = "Bearer " + req.cookies["x-auth-token"];
    next();
  },
  passport.authenticate("jwt", { session: false })
);

taskRouter.post("/", taskController.createTaskPost);

taskRouter.put("/:id", taskController.updateTaskPost);

taskRouter.delete("/:id", taskController.deleteTaskPost);

export default taskRouter;
