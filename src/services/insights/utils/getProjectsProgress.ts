/** * @file getProjectsProgress.ts
 * @author Mostafa Hasan // (mostafafinal55@gmail.com)
 * @summary
 *  This file declares getProjectsProgress internal services util
 *  it's reponsible for gathering projects' progress insight
 * @version 1.0.0
 * @date 2025-04-17
 * @copyright Copyrights (c) 2025
 */

import { prisma } from "../../../configs/prisma";
import { projects, $Enums, users } from "../../../types/prisma";
import { logger } from "../../../utils/logger";

export interface ProgjectProgressModel {
  id: projects["id"];
  name: projects["name"];
  priority: $Enums.Priority;
  status: $Enums.ProjectStatus;
  progress: number;
}

export type GetProjectsProgress = (
  userId: users["id"],
  priority?: $Enums.Priority
) => Promise<ProgjectProgressModel[] | undefined>;

/**
 * @description
 *  GetProjectsProgress is an intenrnal service util responsible
 *  for retrieving and calucating each project progress for
 *  a specific user percentagely. Used by projectsInsight service
 *
 * @function prisma API would be used for retrieving user
 *  projects data & their related tasks
 *
 * @param userId to determine related projects' user
 * @param priority optional, if defined each project's
 *  progress would be determined based on its priority
 * @return array that contains each project data
 *  and progress
 * @example
 *  getProjectsProgress("user-id") // {id: "project-id", name: "prokect-name", prioirity: "high", status: "active", progress: 0}
 */

export const getProjectsProgress: GetProjectsProgress = async (
  userId,
  priority
) => {
  try {
    if (!userId || userId.length !== 24) throw new Error("invalid user id ");

    const rawData = await prisma.projects.findMany({
      where: { userId: userId, priority: priority, OR: [{ userId: userId }] },
      include: { tasks: { where: { status: "completed" } }, _count: true },
      omit: {
        v: true,
        createdAt: true,
        updatedAt: true,
        description: true,
        deadline: true,
        userId: true,
      },
    });

    const insights = rawData.map((project): ProgjectProgressModel => {
      const progress = (project.tasks.length / project._count.tasks) * 100;

      return {
        id: project.id,
        name: project.name,
        priority: project.priority,
        status: project.status,
        progress: Number(progress.toFixed(2)),
      };
    });

    return insights;
  } catch (error) {
    logger.error(error, "PROGJECTS PROGRESS INTERNAL SERVICE UTIL EXCEPTION");
  }
};
