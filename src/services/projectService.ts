import { Types } from "mongoose";
import { Project } from "../models/Project";
import { ProjectModel } from "../types/schemas";
import agenda from "../configs/agenda";
import { User } from "../models/User";

export const createProject = async (
  projectData: ProjectModel
): Promise<ProjectModel | undefined> => {
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

export const getProjects = async (
  userId: Types.ObjectId
): Promise<ProjectModel[] | undefined> => {
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

export const getProject = async (
  projectId: Types.ObjectId
): Promise<ProjectModel | undefined> => {
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

export const updateProject = async (
  projectId: Types.ObjectId,
  updates: Partial<ProjectModel>
) => {
  try {
    if (!projectId || !updates)
      throw new Error(
        "Service: either invalid project id or empty update data"
      );

    await Project.updateOne({ _id: projectId }, { ...updates });
  } catch (error) {
    console.error(error);
  }
};

export const deleteProject = async (
  projectId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  try {
    if (!projectId || !userId)
      throw new Error("Service: project or user id's not provided");

    await Project.deleteOne({ _id: projectId });

    await User.updateOne({ _id: userId }, { $pull: { projects: projectId } });

    agenda.now("delete project tasks", { projectId: projectId });
  } catch (error) {
    console.error(error);
  }
};
