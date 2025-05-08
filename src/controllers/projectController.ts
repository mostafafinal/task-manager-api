import * as service from "../services/projectService/projectService";
import { RegularMiddlewareWithoutNext } from "../types/expressMiddleware";
import { projects } from "../../src/types/prisma";
import { customError } from "../utils/customError";
import { matchedData, validationResult } from "express-validator";
import { Query, queryHandler } from "../services/projectService/queryHandler";

export const createProjectPost: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("error", 400, errors.array()[0].msg);

  const data = matchedData<projects>(req);

  const createdProject = await service.createProject(data);

  if (!createdProject || Object.keys(createdProject).length <= 0)
    throw customError("fatal");

  res.status(201).json({
    status: "success",
    message: "project created successfully",
    data: createdProject,
  });
};

export const queryProjects: RegularMiddlewareWithoutNext = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("error", 400, errors.array()[0].msg);

  const query = matchedData(req);

  const projects = await queryHandler(query as Query);

  if (!projects) throw customError("fatal");

  res.status(200).json({
    status: "success",
    data: projects,
  });
};

// export const queryProjects: RegularMiddlewareWithoutNext = async (req, res) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) throw customError("error", 400, errors.array()[0].msg);

//   const data = matchedData(req);

//   const projects = await service.queryProjects(data.userId, data.search);

//   res.status(200).json({
//     status: "success",
//     data: projects,
//   });
// };

export const getProject: RegularMiddlewareWithoutNext = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("error", 400, errors.array()[0].msg);

  const data = matchedData(req);

  const project = await service.getProject(data.id);

  if (!project) throw customError("error", 404, "project's not found!");

  res.status(200).json({ data: project });
};

export const updateProjectPost: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("error", 400, errors.array()[0].msg);

  const data = matchedData(req);
  delete data.userId;

  const projectId = data.id;
  delete data.id;

  const newData: Partial<projects> = {
    ...data,
  };

  const serviceResult = await service.updateProject(projectId, newData);

  if (!serviceResult) throw customError("fatal");

  res.status(200).json({
    status: "success",
    message: "project updated successfully",
    data: serviceResult,
  });
};

export const deleteProjectPost: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("error", 400, errors.array()[0].msg);

  const data: string = matchedData(req).id;

  const serviceResult = await service.deleteProject(data);

  if (!serviceResult) throw customError("fatal");

  res.status(204).end();
};
