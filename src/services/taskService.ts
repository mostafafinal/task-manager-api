/**
 * @file taskService.ts
 * @author Mostafa Hasan // (mostafafinal55@gmail.com)
 * @summary
 *  This file declares a combination of task services
 *  they're responsible for handling user task CRUD operations
 * @version 1.0.0
 * @date 2025-03-15
 * @copyright Copyrights (c) 2025
 */

import { prisma } from "../configs/prisma";
import { tasks } from "../types/prisma";
import { logger } from "../utils/logger";

export type CreateTask = (data: tasks) => Promise<tasks | undefined>;

/**
 * @description
 *  CreateTask service creates new task and add it into the database
 * @function prisma API would be used for creating a new task in the database
 * @param taskData necessary task data to creae a new task
 * @returns created task
 * @example createTask(...taskData)
 */

export const createTask: CreateTask = async (taskData) => {
  try {
    if (!taskData) throw new Error("task data's not provided");

    const task = await prisma.tasks.create({ data: { ...taskData } });

    if (!task) throw new Error("failed to create task");

    return task;
  } catch (error) {
    logger.error(error, "CREATE TASK SERVICE EXCEPTION");
  }
};

export type GetTask = (taskId: string) => Promise<tasks | undefined>;

/**
 * @description
 *  GetTask service retrieves a snigle task data
 * @function prisma API would be used for searching the task in the database
 * @param taskId for retrieving a specific task data
 * @returns a single task data
 * @example getTask("task-id")
 */

export const getTask: GetTask = async (taskId) => {
  try {
    if (!taskId) throw new Error("task id is not provided");

    const task = await prisma.tasks.findUnique({ where: { id: taskId } });

    if (!task) throw Error("task not found");

    return task;
  } catch (error) {
    logger.error(error, "GET TASK SERVICE EXCEPTION");
  }
};

export type UpdateTask = (
  taskId: string,
  updates: Partial<tasks>
) => Promise<tasks | undefined>;

/**
 * @description
 *  UpdateTask service updates a single task data with the provided one
 * @function prisma API would be used for updating the task in the database
 * @param taskId for determining which task to update
 * @updates new data to be updated
 * @returns the updated task data
 * @example updateTask("task-id", {priority: "high"})
 */

export const updateTask: UpdateTask = async (taskId, updates) => {
  try {
    if (!taskId || !updates)
      throw new Error("either invalid task id or empty update data");

    const task = await prisma.tasks.update({
      data: {
        ...updates,
        v: { increment: 1 },
      },
      where: { id: taskId },
    });

    return task;
  } catch (error) {
    logger.error(error, "UPDATE TASK SERVICE EXCEPTION");
  }
};

/**
 * @description
 *  DeleteTask service deletes a single task specified by the id
 * @function prisma API would be used for deleting the task from the database
 * @param taskId for determining which task to delete
 * @example deleteTask("task-id")
 */

export type DeleteTask = (taskId: string) => Promise<tasks | undefined>;

export const deleteTask: DeleteTask = async (taskId) => {
  try {
    if (!taskId) throw new Error("task or project id's not provided");

    const task = await prisma.tasks.delete({ where: { id: taskId } });

    if (!task) throw new Error("Serive: failed to delete task");

    return task;
  } catch (error) {
    logger.error(error, "DELETE TASK SERVICE EXCEPTION");
  }
};
