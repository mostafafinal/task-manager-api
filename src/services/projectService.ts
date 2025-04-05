import { Types } from "mongoose";
import { Project } from "../models/Project";
import { ProjectModel } from "../types/schemas";
import agenda from "../configs/agenda";
import { User } from "../models/User";

export type CreateProject = (
  data: ProjectModel
) => Promise<ProjectModel | undefined>;

export const createProject: CreateProject = async (projectData) => {
  try {
    if (!projectData) throw new Error("Service: project data's not provided");

    const project = await Project.create(projectData);

    if (!project) throw new Error("Service: failed to create project");

    await User.updateOne(
      { _id: projectData.userId },
      {
        $push: { projects: project.id },
      }
    );

    return project;
  } catch (error) {
    console.error(error);
  }
};

export type GetProjects = (
  userId: Types.ObjectId
) => Promise<ProjectModel[] | undefined>;

export const getProjects: GetProjects = async (userId) => {
  try {
    if (!userId) throw new Error("Service: user's id's not provided");

    const projects = await Project.find({ userId: userId }).select([
      "name",
      "deadline",
      "priority",
      "status",
    ]);

    return projects;
  } catch (error) {
    console.error(error);
  }
};

export type GetProject = (
  projectId: Types.ObjectId
) => Promise<ProjectModel | undefined>;

export const getProject: GetProject = async (projectId) => {
  try {
    if (!projectId) throw new Error("project id is not provided");

    const project: ProjectModel | null = await Project.findById(
      projectId
    ).populate("tasks", ["name", "priority", "deadline", "status"]);

    if (!project) throw Error("project not found");

    return project;
  } catch (error) {
    console.log(error);
  }
};

export type UpdateProject = (
  projectId: Types.ObjectId,
  updates: Partial<ProjectModel>
) => Promise<boolean | undefined>;

export const updateProject: UpdateProject = async (projectId, updates) => {
  try {
    if (!projectId || !updates)
      throw new Error(
        "Service: either invalid project id or empty update data"
      );

    const result = await Project.updateOne({ _id: projectId }, { ...updates });

    return result.acknowledged;
  } catch (error) {
    console.error(error);
  }
};

export type DeleteProject = (
  projectId: Types.ObjectId,
  userId: Types.ObjectId
) => Promise<boolean | undefined>;

export const deleteProject: DeleteProject = async (projectId, userId) => {
  try {
    if (!projectId || !userId)
      throw new Error("Service: project or user id's not provided");

    const result = await Project.deleteOne({ _id: projectId });

    await User.updateOne({ _id: userId }, { $pull: { projects: projectId } });

    await agenda.now("delete project tasks", projectId);

    return result.acknowledged;
  } catch (error) {
    console.error(error);
  }
};
