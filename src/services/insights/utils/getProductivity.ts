/** * @file getProductivity.ts
 * @author Mostafa Hasan // (mostafafinal55@gmail.com)
 * @summary
 *  This file declares getProductivity internal services util
 *  it's reponsible for gathering user productivity accross
 *  specific models for determinde dates
 * @version 1.0.0
 * @date 2025-04-17
 * @copyright Copyrights (c) 2025
 */

import { prisma } from "../../../configs/prisma";
import { $Enums, Prisma, projects, tasks, users } from "../../../types/prisma";
import { logger } from "../../../utils/logger";

export interface ProductiveModel {
  id: projects["id"] | tasks["id"];
  name: projects["name"] | tasks["name"];
  priority: $Enums.Priority;
  status: $Enums.ProjectStatus | $Enums.TaskStatus;
}

export interface ProductivityInsight {
  lastSeven: ProductiveModel[];
  lastThirty: ProductiveModel[];
  lastSixtyFive: ProductiveModel[];
}

export type IncludedModels = projects | tasks;

export type GetProductivity = (
  userId: users["id"],
  modelName: "projects" | "tasks"
) => Promise<ProductivityInsight | undefined>;

/**
 * @description
 *  GetProductivity is an internal service util for gathering
 *  and calucating user productivity accross specific models
 *  for a determinde periods of time i.e. last 7, 30, 365 day
 *  built for "project & task model insights"
 *
 * @function prisma API would be used for gathering user's data
 *
 * @param userId for determining user's data to be gathered
 * @return object that contains productivity related data
 * @example
 *  getProdcutivity("user-id", "tasks")
 *
 *  /* {
 *     lastSeven: [{task-one}, {task-two}];
 *     lastThirty: [{task-one}, {task-two}];
 *     lastSixtyFive: [{task-one}, {task-two}];
 *     }
 *   /
 */

export const getProductivity: GetProductivity = async (userId, modelName) => {
  try {
    if (!Object.keys(Prisma.ModelName).includes(modelName))
      throw new Error("invalid model name");

    // @ts-expect-error signatures have been handled in the previous line
    const data = await prisma[modelName].findMany({
      where: { userId: userId, status: "completed" },
      select: {
        id: true,
        name: true,
        priority: true,
        status: true,
        updatedAt: true,
      },
    });

    const days = (num: number) => num * 24 * 60 * 60 * 1000;

    const lastSeven = data.filter(
      (inst: IncludedModels) =>
        Number(inst.updatedAt) <= Number(new Date()) &&
        Number(inst.updatedAt) >= Number(days(7))
    );

    const lastThirty = data.filter(
      (inst: IncludedModels) =>
        Number(inst.updatedAt) <= Number(new Date()) &&
        Number(inst.updatedAt) >= Number(days(30))
    );

    const lastSixtyFive = data.filter(
      (inst: IncludedModels) =>
        Number(inst.updatedAt) <= Number(new Date()) &&
        Number(inst.updatedAt) >= Number(days(365))
    );

    return {
      lastSeven: lastSeven,
      lastThirty: lastThirty,
      lastSixtyFive: lastSixtyFive,
    };
  } catch (error) {
    logger.error(error, "GET PRODUCTIVITY INTERNAL UTIL SERVICE EXCEPTION");
  }
};
