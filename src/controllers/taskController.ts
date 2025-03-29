import * as service from "../services/taskService";
import { RegularMiddleware } from "../types/expressMiddleware";
import { ObjectId } from "mongodb";
import { TaskModel } from "../types/schemas";

export const createTaskPost: RegularMiddleware = async (req, res, next) => {
  try {
    if (!req.user?.id) throw new Error("controller: user is not existed!");

    const task: TaskModel = {
      name: req.body.name,
      priority: req.body.priority,
      status: req.body.status,
      deadline: req.body.deadline,
      description: req.body.description,
      projectId: req.body.projectId,
      userId: req.user.id,
    };

    const createdTask: TaskModel | undefined = await service.createTask(task);

    res.status(201).json({
      status: "success",
      message: "task created successfully",
      data: createdTask,
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

export const getTaskGet: RegularMiddleware = async (req, res, next) => {
  try {
    if (!req.params.id) throw new Error("task id is not existed");

    const taskId = ObjectId.createFromHexString(req.params.id);

    const task: TaskModel | undefined = await service.getTask(taskId);

    res.status(200).json({ data: task });
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

export const updateTaskPost: RegularMiddleware = async (req, res, next) => {
  try {
    if (!req.params.id) throw new Error("task id's not provided");

    const newData: Partial<TaskModel> = {
      name: req.body.name,
      deadline: req.body.deadline,
      priority: req.body.priority,
      description: req.body.description,
      status: req.body.status,
    };
    const taskId = ObjectId.createFromHexString(req.params.id);

    await service.updateTask(taskId, newData);

    res.status(200).json({
      status: "success",
      message: "task updated successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ status: "fail", message: error.message });

      return;
    }

    next(error);
  }
};

export const deleteTaskPost: RegularMiddleware = async (req, res, next) => {
  try {
    const taskId = ObjectId.createFromHexString(req.params.id);
    if (!taskId) throw new Error("task credentials are not existed");

    await service.deleteTask(taskId);

    res.status(204).json({
      status: "success",
      message: "task deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(401)
        .json({ status: "fail", message: "failed to delete task" });

      return;
    }

    next(error);
  }
};
