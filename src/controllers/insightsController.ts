import { RegularMiddlewareWithoutNext } from "../types/expressMiddleware";
import { matchedData, validationResult } from "express-validator";
import { customError } from "../utils/customError";
import * as service from "../services/insights/insightsService";

export const getDashboardInsightsGet: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("error", 400, errors.array()[0].msg);

  const id: string = matchedData(req).userId;

  const projectsInsight = await service.projectsInsight(id);
  const tasksInsight = await service.tasksInsights(id);

  if (!projectsInsight || !tasksInsight) throw customError("fatal");

  res.status(200).json({
    status: "success",
    data: { projects: projectsInsight, tasks: tasksInsight },
  });
};
