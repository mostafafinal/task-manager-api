/** * @file projectService.ts
 * @author Mostafa Hasan // (mostafafinal55@gmail.com)
 * @summary
 *  This file declares a combination of project services
 *  they're responsible for handling user project CRUD operations
 * @version 1.0.0
 * @date 2025-03-13
 * @copyright Copyrights (c) 2025
 */

import { projects, users } from "../types/prisma";
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
  userId: users["id"],
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

export const getProjects: GetProjects = async (userId, page, limit) => {
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

export type QueryProjects = (
  userId: users["id"],
  query: string
) => Promise<projects[] | undefined>;

/**
 * @description
 *  QueryProjects service queries the projects model to find
 *  any query matches e.g. searching for specific projects
 * @function prisma API would be used for searching projects in the database
 * @param userId to query specific user projects
 * @param query to be used in matching projects
 * @returns founded projects
 */

export const queryProjects: QueryProjects = async (userId, query) => {
  try {
    if (!userId || !query) throw new Error("invalid user or query");

    const projects = await prisma.projects.findMany({
      where: { userId: userId, name: { contains: query, mode: "insensitive" } },
    });

    return projects;
  } catch (error) {
    logger.error(error, "QUERY PROJECTS SERVICE EXCEPTION");
  }
};

export type GetProject = (
  projectId: projects["id"]
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
            description: true,
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
  projectId: projects["id"],
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
  projectId: projects["id"]
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
