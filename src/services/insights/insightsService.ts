/** * @file insightsService.ts
 * @author Mostafa Hasan // (mostafafinal55@gmail.com)
 * @summary
 *  This file declares a combination of insight services
 *  they're responsible for providing models' insights to
 *  be used as reports or in dashboards as analytics
 * @version 1.0.0
 * @date 2025-04-16
 * @copyright Copyrights (c) 2025
 */

import { users } from "../../types/prisma";
import { logger } from "../../utils/logger";
import { GeneralInfo, getGeneralInfo } from "./utils/getGeneralInfo";
import { getProductivity, ProductivityInsight } from "./utils/getProductivity";
import {
  getProjectsProgress,
  ProgjectProgressModel,
} from "./utils/getProjectsProgress";

export interface ProjectsInsightModel {
  general: GeneralInfo | undefined;
  progresses: ProgjectProgressModel[] | undefined;
}

export type ProjectsInsight = (
  userId: string
) => Promise<ProjectsInsightModel | undefined>;

/**
 * @description
 *  ProjectsInsight service provides projects related insight
 *  e.g. projects general info, projects' progress for a
 *  specific user to be used for e.g. dashboards, and reports
 *
 * @function getGeneralInfo
 *  internal service util would be used for handling
 *  and retrieving projects' general information
 * @function getProjectsProgress
 *  internal service util would be used for handling
 *  and retrieving each project progress
 *
 * @param userId to retrieve projects' insights for a specific
 *  user
 * @return projects' insights analytics
 * @example
 * projectsInsights("user-id") // {general: GeneralInfo, progresses: ProjectProgressModel[]}
 */

export const projectsInsight: ProjectsInsight = async (userId) => {
  try {
    if (!userId || userId.length !== 24) throw new Error("invalid user id");

    const info = await getGeneralInfo(userId, "projects");
    const progresss = await getProjectsProgress(userId);

    return { general: info, progresses: progresss };
  } catch (error) {
    logger.error(error, "PROJECTS INSIGHT SERVICE EXCEPTION");
  }
};

export interface TasksInsightModel {
  general: GeneralInfo | undefined;
  productivity: ProductivityInsight | undefined;
}

export type TasksInsights = (
  userId: users["id"]
) => Promise<TasksInsightModel | undefined>;

/**
 * @description
 *  TasksInsight service provides tasks related insight
 *  e.g. tasks general info, tasks' progress for a
 *  specific user to be used for e.g. dashboards, and reports
 *
 * @function getGeneralInfo
 *  internal service util would be used for handling
 *  and retrieving tasks' general information
 * @function getProductivity
 *  internal services util would be used for gathering
 *  user tasks' productivity
 *
 * @param userId to retrieve tasks' insights for a specific
 *  user
 * @return tasks' insights analytics
 * @example tasksInsights("user-id") // {general: GeneralInfo}
 */

export const tasksInsights: TasksInsights = async (userId) => {
  try {
    if (!userId || userId.length !== 24) throw new Error("invalid user id");

    const info = await getGeneralInfo(userId, "tasks");
    const productivity = await getProductivity(userId, "tasks");

    return { general: info, productivity: productivity };
  } catch (error) {
    logger.error(error, "TASKS INSIGHT SERVICE EXCEPTION");
  }
};
