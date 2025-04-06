import * as service from "../services/projectService";
import { RegularMiddlewareWithoutNext } from "../types/expressMiddleware";
import { ObjectId } from "mongodb";
import { ProjectModel } from "../types/schemas";
import { customError } from "../utils/customError";

export const createProjectPost: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  if (!req.body || Object.keys(req.body).length <= 0)
    throw customError("fail", 400, "invalid project data");

  const project: ProjectModel = {
    ...req.body,
    userId: req.user?.id,
  };

  const createdProject: ProjectModel | undefined =
    await service.createProject(project);

  if (!createdProject || Object.keys(createdProject).length <= 0)
    throw customError();

  res.status(201).json({
    status: "success",
    message: "project created successfully",
    data: createdProject,
  });
};

export const getProjects: RegularMiddlewareWithoutNext = async (req, res) => {
  const { page, limit } = req.query;

  if (page === "" || limit === "")
    throw customError("fail", 400, "invalid projects query!");

  const projects = await service.getProjects(
    req.user?.id,
    page as undefined,
    limit as undefined
  );

  if (!projects) throw customError();

  res.status(200).json({
    status: "success",
    data: projects,
  });
};

export const getProject: RegularMiddlewareWithoutNext = async (req, res) => {
  if (!req.params.id || req.params.id.length !== 24)
    throw customError("fail", 400, "invalid project credentials!");

  const projectId = ObjectId.createFromHexString(req.params.id);

  const project: ProjectModel | undefined = await service.getProject(projectId);

  if (!project) throw customError("fail", 404, "project not found!");

  res.status(200).json({ data: project });
};

export const updateProjectPost: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  if (!req.params.id || req.params.id.length !== 24)
    throw customError("fail", 400, "invalid project credentials!");

  const projectId = ObjectId.createFromHexString(req.params.id);

  const newData: Partial<ProjectModel> = {
    ...req.body,
  };

  const serviceResult = await service.updateProject(projectId, newData);

  if (!serviceResult) throw customError();

  res.status(200).json({
    status: "success",
    message: "project updated successfully",
  });
};

export const deleteProjectPost: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  if (
    !req.user?.id ||
    !req.params.id ||
    req.user?.id.length !== 24 ||
    req.params.id.length != 24
  )
    throw customError("fail", 400, "invalid user or project credentials");

  const userId = ObjectId.createFromHexString(req.user?.id);
  const projectId = ObjectId.createFromHexString(req.params.id);

  const serviceResult = await service.deleteProject(projectId, userId);

  if (!serviceResult) throw customError();

  res.status(204).json({
    status: "success",
    message: "project deleted successfully",
  });
};
