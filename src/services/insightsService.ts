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

import { Prisma } from "../types/prisma";
import { countModelFields } from "../utils/countModelFields";
import { logger } from "../utils/logger";

export interface GeneralInfo {
  total: number;
  status: object;
  priority: object;
}

export type GetGeneralInfo = (
  userId: string,
  modelName: Prisma.TypeMap["meta"]["modelProps"]
) => Promise<GeneralInfo | undefined>;

/**
 * @description
 *  GetGeneralInfo internal service util provides projects & tasks related insights
 *  e.g. total projects/tasks, projects/tasks' status & priorities for a
 *  specific user. Is used by projectsInsights & tasksInsights services
 *
 * @function countModelFields
 *  util would be used for handling
 *  and retrieving projects & tasks' insights
 *
 * @param userId to retrieve projects & tasks' insights for a specific
 *  user
 * @return projects & tasks' insights analytics
 * @example getGeneralInfo("user-id", "projects") // {total: n, status: {objs}, priority: {objs}}
 */

export const getGeneralInfo: GetGeneralInfo = async (userId, modelName) => {
  try {
    if (!userId || userId.length !== 24) throw new Error("invalid user id");
    if (!(modelName in Prisma.ModelName)) throw new Error("invalid model name");

    const statusInsights = await countModelFields(userId, "projects", [
      "status",
    ]);
    const priorityInsights = await countModelFields(userId, "projects", [
      "priority",
    ]);

    if (!statusInsights || !priorityInsights)
      throw new Error("failed to get general info insights");

    const totalInsight = Object.keys(statusInsights).reduce(
      // @ts-expect-error validated and tested util
      (acc, curr) => acc + statusInsights[curr]._count,
      0
    );

    return {
      total: totalInsight,
      status: statusInsights,
      priority: priorityInsights,
    };
  } catch (error) {
    logger.error(error, "GENERAL INFO INTERNAL SERVICE UTIL EXCEPTION");
  }
};

export interface ProjectsInsightModel {
  general: GeneralInfo | undefined;
}

export type ProjectsInsight = (
  userId: string
) => Promise<ProjectsInsightModel | undefined>;

/**
 * @description
 *  ProjectsInsight service provides projects related insight
 *  e.g. projects general info, projects' progress for a
 *  specific user. Use cases e.g. dashboards, and reports
 *
 * @function getGeneralInfo
 *  internal service util would be used for handling
 *  and retrieving projects' general information
 * @function getProgresses
 *  internal service util would be used for handling
 *  and retrieving each project progress
 *
 * @param userId to retrieve projects' insights for a specific
 *  user
 * @return projects' insights analytics
 * @example projectsInsights("user-id") // {general: GeneralInfo}
 */

export const projectsInsight: ProjectsInsight = async (userId) => {
  try {
    if (!userId || userId.length !== 24) throw new Error("invalid user id");

    const info = await getGeneralInfo(userId, "projects");

    return { general: info };
  } catch (error) {
    logger.error(error, "PROJECTS INSIGHT SERVICE EXCEPTION");
  }
};

export interface TasksInsightModel {
  general: GeneralInfo | undefined;
}

export type TasksInsights = (
  userId: string
) => Promise<TasksInsightModel | undefined>;

/**
 * @description
 *  TasksInsight service provides tasks related insight
 *  e.g. tasks general info, tasks' progress for a
 *  specific user. Use cases e.g. dashboards, and reports
 *
 * @function getGeneralInfo
 *  internal service util would be used for handling
 *  and retrieving tasks' general information
 * @function getProgresses
 *  internal service util would be used for handling
 *  and retrieving each project progress
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

    return { general: info };
  } catch (error) {
    logger.error(error, "TASKS INSIGHT SERVICE EXCEPTION");
  }
};
