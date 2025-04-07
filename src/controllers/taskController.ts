import * as service from "../services/taskService";
import { RegularMiddlewareWithoutNext } from "../types/expressMiddleware";
import { ObjectId } from "mongodb";
import { TaskModel } from "../types/schemas";
import { customError } from "../utils/customError";
import { matchedData, validationResult } from "express-validator";

export const createTaskPost: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw customError("fail", 400, errors.array()[0].msg);

  const data = matchedData<TaskModel>(req);

  const task: TaskModel = {
    ...data,
    userId: req.user?.id,
  };

  const createdTask: TaskModel | undefined = await service.createTask(task);

  if (!createdTask) throw customError();

  res.status(201).json({
    status: "success",
    message: "task created successfully",
    data: createdTask,
  });
};

export const getTaskGet: RegularMiddlewareWithoutNext = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("fail", 400, errors.array()[0].msg);

  const params = matchedData(req);

  const taskId = ObjectId.createFromHexString(params.id);

  const task: TaskModel | undefined = await service.getTask(taskId);

  if (!task) throw customError();

  res.status(200).json({ data: task });
};

export const updateTaskPost: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("fail", 400, errors.array()[0].msg);

  const data = matchedData(req);

  const taskId = ObjectId.createFromHexString(data.id);
  delete data.id;

  const serviceResult = await service.updateTask(taskId, data);

  if (!serviceResult) throw customError();

  res.status(200).json({
    status: "success",
    message: "task updated successfully",
  });
};

export const deleteTaskPost: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw customError("fail", 400, errors.array()[0].msg);

  const params = matchedData(req);

  const taskId = ObjectId.createFromHexString(params.id);

  const serviceResult = await service.deleteTask(taskId);

  if (!serviceResult) throw customError();

  res.status(204).json({
    status: "success",
    message: "task deleted successfully",
  });
};
