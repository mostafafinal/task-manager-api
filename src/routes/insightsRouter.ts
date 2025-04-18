import { Router } from "express";
import isAuth from "../middlewares/isAuth";
import * as validate from "../validators/objectIdValidator";
import { tryCatch } from "../utils/tryCatch";
import * as controller from "../controllers/insightsController";

const insightsRouter = Router();

insightsRouter.use(isAuth, validate.validateUserId);

insightsRouter.get("/dashboard", tryCatch(controller.getDashboardInsightsGet));

export default insightsRouter;
