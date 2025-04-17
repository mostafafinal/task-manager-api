/** * @file getGeneralInfo.ts
 * @author Mostafa Hasan // (mostafafinal55@gmail.com)
 * @summary
 *  This file declares getGeneralInfo internal services util
 *  it's reponsible for gathering projects/tasks general insights
 * @version 1.0.0
 * @date 2025-04-16
 * @copyright Copyrights (c) 2025
 */

import { countModelFields } from "./countModelFields";
import { Prisma, users } from "../../../types/prisma";
import { logger } from "../../../utils/logger";

export interface GeneralInfo {
  total: number;
  status: object;
  priority: object;
}

export type GetGeneralInfo = (
  userId: users["id"],
  modelName: Prisma.TypeMap["meta"]["modelProps"]
) => Promise<GeneralInfo | undefined>;

/**
 * @description
 *  GetGeneralInfo internal service util provides projects & tasks related insights
 *  e.g. total projects/tasks, projects/tasks' status & priorities for a
 *  specific user. Used by projectsInsights & tasksInsights services
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

    const statusInsights = await countModelFields(userId, modelName, [
      "status",
    ]);
    const priorityInsights = await countModelFields(userId, modelName, [
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
