import * as service from "../services/taskService";
import { RegularMiddlewareWithoutNext } from "../types/expressMiddleware";
import { tasks } from "../../src/types/prisma";
import { customError } from "../utils/customError";
import { matchedData, validationResult } from "express-validator";

export const createTaskPost: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("error", 400, errors.array()[0].msg);

  const data = matchedData<tasks>(req);

  const task: tasks = {
    ...data,
  };

  const createdTask = await service.createTask(task);

  if (!createdTask) throw customError("fatal");

  res.status(201).json({
    status: "success",
    message: "task created successfully",
    data: createdTask,
  });
};

export const getTaskGet: RegularMiddlewareWithoutNext = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("error", 400, errors.array()[0].msg);

  const data = matchedData(req);
  delete data.userId;

  const task = await service.getTask(data.id);

  if (!task) throw customError("error", 404, "task not found!");

  res.status(200).json({ status: "success", data: task });
};

export const updateTaskPost: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("error", 400, errors.array()[0].msg);

  const data = matchedData(req);
  delete data.userId;

  const taskId = data.id;
  delete data.id;

  const serviceResult = await service.updateTask(taskId, data);

  if (!serviceResult) throw customError("fatal");

  res.status(200).json({
    status: "success",
    message: "task updated successfully",
    data: serviceResult,
  });
};

export const deleteTaskPost: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("error", 400, errors.array()[0].msg);

  const id = matchedData(req).id;

  const serviceResult = await service.deleteTask(id);

  if (!serviceResult) throw customError("fatal");

  res.status(204).end();
};
