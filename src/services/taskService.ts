import { HydratedDocument, Types } from "mongoose";
import { Task } from "../models/Task";
import { TaskModel } from "../types/schemas";
import { Project } from "../models/Project";

export type GetTask = (
  taskId: Types.ObjectId
) => Promise<TaskModel | undefined>;

export const getTask: GetTask = async (taskId) => {
  try {
    if (!taskId) throw new Error("task id is not provided");

    const task: TaskModel | null = await Task.findById(taskId);

    if (!task) throw Error("task not found");

    return task;
  } catch (error) {
    console.log(error);
  }
};

export type CreateTask = (data: TaskModel) => Promise<TaskModel | undefined>;

export const createTask: CreateTask = async (taskData) => {
  try {
    if (!taskData) throw new Error("Service: task data's not provided");

    const task: HydratedDocument<TaskModel> = await Task.create(taskData);

    if (!task) throw new Error("Service: failed to create task");

    await Project.updateOne(
      { _id: taskData.projectId },
      { $push: { tasks: task.id } }
    );

    return task;
  } catch (error) {
    console.error(error);
  }
};

export type UpdateTask = (
  taskId: Types.ObjectId,
  updates: Partial<TaskModel>
) => Promise<boolean | undefined>;

export const updateTask: UpdateTask = async (taskId, updates) => {
  try {
    if (!taskId || !updates)
      throw new Error("Service: either invalid task id or empty update data");

    const result = await Task.updateOne({ _id: taskId }, { ...updates });

    return result.acknowledged;
  } catch (error) {
    console.error(error);
  }
};

export type DeleteTask = (
  taskId: Types.ObjectId
) => Promise<boolean | undefined>;

export const deleteTask: DeleteTask = async (taskId) => {
  try {
    if (!taskId) throw new Error("Service: task or project id's not provided");

    const deletedTask: HydratedDocument<TaskModel> | null =
      await Task.findOneAndDelete({ _id: taskId });

    if (!deletedTask) throw new Error("Serive: failed to delete task");

    await Project.updateOne(
      { _id: deletedTask.projectId },
      { $pull: { tasks: taskId } }
    );

    return true;
  } catch (error) {
    console.error(error);
  }
};
