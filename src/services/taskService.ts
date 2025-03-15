import { Types } from "mongoose";
import { Task } from "../models/Task";
import { TaskModel } from "../types/schemas";

export const createTask = async (taskData: TaskModel) => {
  try {
    if (!taskData) throw new Error("Service: task data's not provided");

    await Task.create(taskData);
  } catch (error) {
    console.error(error);
  }
};

export const getTasks = async (projectId: Types.ObjectId) => {
  try {
    if (!projectId) throw new Error("Service: user's id's not provided");

    await Task.find({ projectId: projectId });
  } catch (error) {
    console.error(error);
  }
};

export const updateTask = async (
  taskId: Types.ObjectId,
  updates: Partial<TaskModel>
) => {
  try {
    if (!taskId || !updates)
      throw new Error("Service: either invalid task id or empty update data");

    await Task.updateOne({ _id: taskId }, { ...updates });
  } catch (error) {
    console.error(error);
  }
};

export const deleteTask = async (taskId: Types.ObjectId) => {
  try {
    if (!taskId) throw new Error("Service: task id's not provided");

    await Task.deleteOne({ _id: taskId });
  } catch (error) {
    console.error(error);
  }
};
