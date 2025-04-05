import * as service from "../services/taskService";
import { RegularMiddlewareWithoutNext } from "../types/expressMiddleware";
import { ObjectId } from "mongodb";
import { TaskModel } from "../types/schemas";
import { customError } from "../utils/customError";

export const createTaskPost: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  if (!req.body || Object.keys(req.body).length <= 0)
    throw customError("fail", 400, "invalid task data");

  const task: TaskModel = {
    ...req.body,
    userId: req.user?.id,
  };

  const createdTask: TaskModel | undefined = await service.createTask(task);

  if (createdTask) throw customError();

  res.status(201).json({
    status: "success",
    message: "task created successfully",
    data: createdTask,
  });
};

export const getTaskGet: RegularMiddlewareWithoutNext = async (req, res) => {
  if (!req.params.id || req.params.id.length !== 24)
    throw customError("fail", 400, "invalid task credentials");

  const taskId = ObjectId.createFromHexString(req.params.id);

  const task: TaskModel | undefined = await service.getTask(taskId);

  if (!task) throw customError();

  res.status(200).json({ data: task });
};

export const updateTaskPost: RegularMiddlewareWithoutNext = async (
  req,
  res
) => {
  if (!req.params.id || req.params.id.length !== 24)
    throw customError("fail", 400, "invalid task credentials");

  if (!req.body || Object.keys(req.body).length <= 0)
    throw customError("fail", 400, "invalid task data");

  const newData: Partial<TaskModel> = {
    ...req.body,
  };
  const taskId = ObjectId.createFromHexString(req.params.id);

  const serviceResult = await service.updateTask(taskId, newData);

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
  if (!req.params.id || req.params.id.length !== 24)
    throw customError("fail", 400, "invalid task credentials");

  const taskId = ObjectId.createFromHexString(req.params.id);

  const serviceResult = await service.deleteTask(taskId);

  if (!serviceResult) throw customError();

  res.status(204).json({
    status: "success",
    message: "task deleted successfully",
  });
};
