/** * @file projectService.ts
 * @author Mostafa Hasan // (mostafafinal55@gmail.com)
 * @summary
 *  This file declares a combination of insight services
 *  they're responsible for providing models' insights to
 *  be used as reports or in dashboards as analytics
 * @version 1.0.0
 * @date 2025-04-16
 * @copyright Copyrights (c) 2025
 */

import { countModelFields } from "../utils/countModelFields";
import { logger } from "../utils/logger";

export type ProjectsInsights = (userId: string) => Promise<unknown>;

/**
 * @description
 *  ProjectsInsights service provides projects related insights
 *  e.g. total projects, projects' status & priorities for a
 *  specific user. Use cases e.g. dashboards, and reports
 *
 * @function countModelFields
 *  util would be used for handling
 *  and retrieving projects' insights
 *
 * @param userId to retrieve projects' insights for a specific
 *  user
 * @return projects' insights analytics
 * @example projectsInsights("user-id") // {total: n, status: {objs}, priority: {objs}}
 */

export const projectsInsights: ProjectsInsights = async (userId) => {
  try {
    if (!userId || userId.length !== 24) throw new Error("invalid user id");

    const statusInsights = await countModelFields(userId, "projects", [
      "status",
    ]);
    const priorityInsights = await countModelFields(userId, "projects", [
      "priority",
    ]);

    if (!statusInsights || !priorityInsights)
      throw new Error("failed to get projects insights");

    const totalProjects = Object.keys(statusInsights).reduce(
      // @ts-expect-error validated and tested util
      (acc, curr) => acc + statusInsights[curr]._count,
      0
    );

    return {
      total: totalProjects,
      status: statusInsights,
      priority: priorityInsights,
    };
  } catch (error) {
    logger.error(error, "PROJECT INSIGHTS SERVICE EXCEPTION");
  }
};
