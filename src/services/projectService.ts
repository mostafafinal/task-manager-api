import { projects } from "../types/prisma";
import { prisma } from "../configs/prisma";

export type CreateProject = (data: projects) => Promise<projects | undefined>;

export const createProject: CreateProject = async (projectData) => {
  try {
    if (!projectData) throw new Error("Service: project data's not provided");

    const project = await prisma.projects.create({
      data: {
        ...projectData,
      },
    });

    if (!project) throw new Error("Service: failed to create project");

    return project;
  } catch (error) {
    console.error(error);
  }
};

export type GetProjects = (
  userId: string,
  page: number,
  limit: number
) => Promise<{ projects: Partial<projects>[]; pages: number } | undefined>;

export const getProjects: GetProjects = async (
  userId: string,
  page: number = 1,
  limit: number = 20
) => {
  try {
    if (!userId) throw new Error("Service: user's id's not provided");

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
    console.error(error);
  }
};

export type GetProject = (
  projectId: string
) => Promise<Partial<projects> | undefined>;

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
    console.error(error);
  }
};

export type UpdateProject = (
  projectId: string,
  updates: Partial<projects>
) => Promise<projects | undefined>;

export const updateProject: UpdateProject = async (projectId, updates) => {
  try {
    if (!projectId || !updates)
      throw new Error(
        "Service: either invalid project id or empty update data"
      );

    const result = await prisma.projects.update({
      data: { ...updates, v: { increment: 1 } },
      where: { id: projectId },
    });

    return result;
  } catch (error) {
    console.error(error);
  }
};

export type DeleteProject = (
  projectId: string
) => Promise<projects | undefined>;

export const deleteProject: DeleteProject = async (projectId) => {
  try {
    if (!projectId) throw new Error("project id's not provided");

    const result = await prisma.projects.delete({ where: { id: projectId } });

    return result;
  } catch (error) {
    console.error(error);
  }
};
