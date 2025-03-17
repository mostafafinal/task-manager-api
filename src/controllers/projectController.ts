import * as service from "../services/projectService";
import { RegularMiddleware } from "../types/expressMiddleware";
import { ObjectId } from "mongodb";
import { ProjectModel } from "../types/schemas";

export const createProjectPost: RegularMiddleware = async (req, res, next) => {
  try {
    const { project } = req.body;
    const { userId } = req.cookies;

    if (!project) throw new Error("project data's not provided");
    if (!userId) throw new Error("user credentials are not existed");

    const createdProject: ProjectModel | undefined =
      await service.createProject(project);

    res.json({
      status: "success",
      message: "project created successfully",
      data: createdProject,
    });
  } catch (error) {
    console.error(error);

    res.json({ status: "fail", message: "failed to create project" });
    next(error);
  }
};

export const getProjects: RegularMiddleware = async (req, res, next) => {
  try {
    const userId = ObjectId.createFromHexString(req.cookies.userId);

    if (!userId) throw new Error("user credentials are not existed");

    const projects: ProjectModel[] | undefined =
      await service.getProjects(userId);

    res.status(200).json({
      data: projects,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateProjectPost: RegularMiddleware = async (req, res, next) => {
  try {
    const { newData } = req.body;
    const projectId = ObjectId.createFromHexString(req.cookies.projectId);

    if (!newData) throw new Error("project data's not provided");
    if (!projectId) throw new Error("user credentials are not existed");

    await service.updateProject(projectId, newData);

    res.json({
      status: "success",
      message: "project updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.json({ status: "fail", message: "failed to update project" });
    next(error);
  }
};

export const deleteProjectPost: RegularMiddleware = async (req, res, next) => {
  try {
    const projectId = ObjectId.createFromHexString(req.cookies.projectId);

    if (!projectId) throw new Error("user credentials are not existed");

    await service.deleteProject(projectId);

    res.status(201).json({
      status: "success",
      message: "project deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.json({ status: "fail", message: "failed to delete project" });
    next(error);
  }
};
