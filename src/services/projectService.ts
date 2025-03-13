import { Types } from "mongoose";
import { Project } from "../models/Project";
import { ProjectModel } from "../types/schemas";
import agenda from "../configs/agenda";

export const createProject = async (projectData: ProjectModel) => {
  try {
    if (!projectData) throw new Error("Service: project data's not provided");

    await Project.create(projectData);
  } catch (error) {
    console.error(error);
  }
};

export const getProjects = async (userId: Types.ObjectId) => {
  try {
    if (!userId) throw new Error("Service: user's id's not provided");

    await Project.find({ userId: userId });
  } catch (error) {
    console.error(error);
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

export const deleteProject = async (projectId: Types.ObjectId) => {
  try {
    if (!projectId) throw new Error("Service: project id's not provided");

    await Project.deleteOne({ _id: projectId });

    agenda.now("delete project tasks", { projectId: projectId });
  } catch (error) {
    console.error(error);
  }
};
