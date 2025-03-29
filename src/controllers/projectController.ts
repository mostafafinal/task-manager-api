import * as service from "../services/projectService";
import { RegularMiddleware } from "../types/expressMiddleware";
import { ObjectId } from "mongodb";
import { ProjectModel } from "../types/schemas";
import { Types } from "mongoose";

export const createProjectPost: RegularMiddleware = async (req, res, next) => {
  try {
    const userId: Types.ObjectId = req.user?.id;

    if (!userId) throw new Error("user credentials are not existed");

    const project: ProjectModel = {
      name: req.body.name,
      priority: req.body.priority,
      status: req.body.status,
      deadline: req.body.deadline,
      description: req.body.description,
      userId: userId,
    };

    const createdProject: ProjectModel | undefined =
      await service.createProject(project);

    res.status(201).json({
      status: "success",
      message: "project created successfully",
      data: createdProject,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({
        status: "fail",
        message: error.message,
      });

      return;
    }

    next(error);
  }
};

export const getProjects: RegularMiddleware = async (req, res, next) => {
  try {
    const userId = ObjectId.createFromHexString(req.user?.id);

    if (!userId) throw new Error("user credentials are not existed");

    const projects: ProjectModel[] | undefined =
      await service.getProjects(userId);

    res.status(200).json({
      data: projects,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({
        status: "fail",
        message: error.message,
      });

      return;
    }

    next(error);
  }
};

export const getProject: RegularMiddleware = async (req, res, next) => {
  try {
    if (!req.params.id) throw new Error("task id is not existed");

    const projectId = ObjectId.createFromHexString(req.params.id);

    const project: ProjectModel | undefined =
      await service.getProject(projectId);

    res.status(200).json({ data: project });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({
        status: "fail",
        message: error.message,
      });

      return;
    }

    next(error);
  }
};

export const updateProjectPost: RegularMiddleware = async (req, res, next) => {
  try {
    if (!req.params.id) throw new Error("project data's not provided");

    const newData: Partial<ProjectModel> = {
      name: req.body.name,
      deadline: req.body.deadline,
      priority: req.body.priority,
      description: req.body.description,
      status: req.body.status,
    };
    const projectId = ObjectId.createFromHexString(req.params.id);

    await service.updateProject(projectId, newData);

    res.status(200).json({
      status: "success",
      message: "project updated successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({
        status: "fail",
        message: error.message,
      });

      return;
    }

    next(error);
  }
};

export const deleteProjectPost: RegularMiddleware = async (req, res, next) => {
  try {
    if (!req.user?.id || !req.params.id)
      throw new Error("user credentials are not existed");

    const userId = ObjectId.createFromHexString(req.user?.id);
    const projectId = ObjectId.createFromHexString(req.params.id);

    await service.deleteProject(projectId, userId);

    res.status(204).json({
      status: "success",
      message: "project deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({
        status: "fail",
        message: error.message,
      });

      return;
    }

    next(error);
  }
};
