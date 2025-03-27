import { HydratedDocument, Types } from "mongoose";
import { Task } from "../models/Task";
import { TaskModel } from "../types/schemas";
import { Project } from "../models/Project";

export const getTask = async (
  taskId: Types.ObjectId
): Promise<TaskModel | undefined> => {
  try {
    if (!taskId) throw new Error("task id is not provided");

    const task: TaskModel | null = await Task.findById(taskId);

    if (!task) throw Error("task not found");

    return task;
  } catch (error) {
    console.log(error);
  }
};

export const createTask = async (
  taskData: TaskModel
): Promise<TaskModel | undefined> => {
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
    if (!taskId) throw new Error("Service: task or project id's not provided");

    const deletedTask: HydratedDocument<TaskModel> | null =
      await Task.findOneAndDelete({ _id: taskId });

    if (!deletedTask) throw new Error("Serive: failed to delete task");

    await Project.updateOne(
      { _id: deletedTask.projectId },
      { $pull: { tasks: taskId } }
    );
  } catch (error) {
    console.error(error);
  }
};
