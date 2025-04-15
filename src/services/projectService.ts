/** * @file projectService.ts
 * @author Mostafa Hasan // (mostafafinal55@gmail.com)
 * @summary
 *  This file declares a combination of project services
 *  they're responsible for handling user project CRUD operations
 * @version 1.0.0
 * @date 2025-03-13
 * @copyright Copyrights (c) 2025
 */

import { projects } from "../types/prisma";
import { prisma } from "../configs/prisma";
import { logger } from "../utils/logger";

export type CreateProject = (data: projects) => Promise<projects | undefined>;

/**
 * @description
 *  CreateProject service creates new project and add it into the database
 * @function prisma API would be used for creating a new project in the database
 * @param projectData necessary project data to creae a new project
 * @returns created project
 * @example createProject(...projectData)
 */

export const createProject: CreateProject = async (projectData) => {
  try {
    if (!projectData) throw new Error("project data's not provided");

    const project = await prisma.projects.create({
      data: {
        ...projectData,
      },
    });

    if (!project) throw new Error("failed to create project");

    return project;
  } catch (error) {
    logger.error(error, "CREATE PROJECT SERVICE EXCEPTION");
  }
};

export type GetProjects = (
  userId: string,
  page: number,
  limit: number
) => Promise<{ projects: Partial<projects>[]; pages: number } | undefined>;

/**
 * @description
 *  GetProjects service retrieves a determined projects volume
 *  optimized for pagination view
 * @function prisma API would be used for searching projects in the database
 * @param userId to get user projects
 * @param page to determine projects pagination
 * @param limit to determine the number of project per page
 * @returns determined projects volume
 * @example getProjects("user-id", 2, 10)
 */

export const getProjects: GetProjects = async (
  userId: string,
  page: number = 1,
  limit: number = 20
) => {
  try {
    if (!userId) throw new Error("user's id's not provided");

    const startIndex: number = (+page - 1) * +limit;

    const totalProjects: number = await prisma.projects.count({
      where: { userId: userId },
    });

    const paginations: number = Math.ceil(totalProjects / +limit);

    const projects = await prisma.projects.findMany({
      where: { userId: userId },
      take: +limit,
      skip: startIndex,
      select: {
        id: true,
        name: true,
        deadline: true,
        priority: true,
        status: true,
      },
    });

    return { projects: projects, pages: paginations };
  } catch (error) {
    logger.error(error, "GET PROJECTS SERVICE EXCEPTION");
  }
};

export type GetProject = (
  projectId: string
) => Promise<Partial<projects> | undefined>;

/**
 * @description
 *  GetProject service retrieves a snigle project data
 * @function prisma API would be used for searching the project in the database
 * @param projectId for retrieving a specific project data
 * @returns a single project data
 * @example getProject("project-id")
 */

export const getProject: GetProject = async (projectId) => {
  try {
    if (!projectId) throw new Error("project id is not provided");

    const project = await prisma.projects.findUnique({
      where: { id: projectId },
      include: {
        tasks: {
          select: {
            id: true,
            name: true,
            priority: true,
            deadline: true,
            status: true,
          },
        },
      },
    });

    if (!project) throw Error("project not found");

    return project;
  } catch (error) {
    logger.error(error, "GET PROJECT SERVICE EXCEPTION");
  }
};

export type UpdateProject = (
  projectId: string,
  updates: Partial<projects>
) => Promise<projects | undefined>;

/**
 * @description
 *  UpdateProject service updates a single project data with the provided one
 * @function prisma API would be used for updating the project in the database
 * @param projectId for determining which project to update
 * @updates new data to be updated
 * @returns the updated project data
 * @example updateProject("project-id", {priority: "high"})
 */

export const updateProject: UpdateProject = async (projectId, updates) => {
  try {
    if (!projectId || !updates)
      throw new Error("either invalid project id or empty update data");

    const result = await prisma.projects.update({
      data: { ...updates, v: { increment: 1 } },
      where: { id: projectId },
    });

    return result;
  } catch (error) {
    logger.error(error, "UPDATE PROJECT SERVICE EXCEPTION");
  }
};

/**
 * @description
 *  DeleteProject service deletes a single project specified by the id
 * @function prisma API would be used for deleting the project from the database
 * @param projectId for determining which project to delete
 * @example deleteProject("project-id")
 */

export type DeleteProject = (
  projectId: string
) => Promise<projects | undefined>;

export const deleteProject: DeleteProject = async (projectId) => {
  try {
    if (!projectId) throw new Error("project id's not provided");

    const result = await prisma.projects.delete({ where: { id: projectId } });

    return result;
  } catch (error) {
    logger.error(error, "DELETE PROJECT SERVICE EXCEPTION");
  }
};
