import * as service from "../services/projectService";
import { RegularMiddlewareWithoutNext } from "../types/expressMiddleware";
import { ProjectModel } from "../types/schemas";
import { customError } from "../utils/customError";
import { matchedData, validationResult } from "express-validator";

export const createProjectPost: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("fail", 400, errors.array()[0].msg);

  const data = matchedData<ProjectModel>(req);

  const project: ProjectModel = {
    ...data,
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("fail", 400, errors.array()[0].msg);

  const data = matchedData(req);

  const projects = await service.getProjects(
    data.userId,
    data.page,
    data.limit
  );

  if (!projects) throw customError();

  res.status(200).json({
    status: "success",
    data: projects,
  });
};

export const getProject: RegularMiddlewareWithoutNext = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("fail", 400, errors.array()[0].msg);

  const data = matchedData(req);

  const project: ProjectModel | undefined = await service.getProject(data.id);

  if (!project) throw customError("fail", 404, "project not found!");

  res.status(200).json({ data: project });
};

export const updateProjectPost: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("fail", 400, errors.array()[0].msg);

  const data = matchedData(req);
  delete data.userId;

  const projectId = data.id;
  delete data.id;

  const newData: Partial<ProjectModel> = {
    ...data,
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("fail", 400, errors.array()[0].msg);

  const data = matchedData(req);

  const serviceResult = await service.deleteProject(data.id, data.userId);

  if (!serviceResult) throw customError();

  res.status(204).end();
};
