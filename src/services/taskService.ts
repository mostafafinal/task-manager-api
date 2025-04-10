import { prisma } from "../configs/prisma";
import { tasks } from "../types/prisma";

export type GetTask = (taskId: string) => Promise<tasks | undefined>;

export const getTask: GetTask = async (taskId) => {
  try {
    if (!taskId) throw new Error("task id is not provided");

    const task = await prisma.tasks.findUnique({ where: { id: taskId } });

    if (!task) throw Error("task not found");

    return task;
  } catch (error) {
    console.error(error);
  }
};

export type CreateTask = (data: tasks) => Promise<tasks | undefined>;

export const createTask: CreateTask = async (taskData) => {
  try {
    if (!taskData) throw new Error("Service: task data's not provided");

    const task = await prisma.tasks.create({ data: { ...taskData } });

    if (!task) throw new Error("Service: failed to create task");

    return task;
  } catch (error) {
    console.error(error);
  }
};

export type UpdateTask = (
  taskId: string,
  updates: Partial<tasks>
) => Promise<tasks | undefined>;

export const updateTask: UpdateTask = async (taskId, updates) => {
  try {
    if (!taskId || !updates)
      throw new Error("Service: either invalid task id or empty update data");

    const task = await prisma.tasks.update({
      data: {
        ...updates,
        v: { increment: 1 },
      },
      where: { id: taskId },
    });

    return task;
  } catch (error) {
    console.error(error);
  }
};

export type DeleteTask = (taskId: string) => Promise<tasks | undefined>;

export const deleteTask: DeleteTask = async (taskId) => {
  try {
    if (!taskId) throw new Error("Service: task or project id's not provided");

    const task = await prisma.tasks.delete({ where: { id: taskId } });

    if (!task) throw new Error("Serive: failed to delete task");

    return task;
  } catch (error) {
    console.error(error);
  }
};
