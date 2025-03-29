import { Agenda, Job } from "@hokify/agenda";
import { Task } from "../models/Task";
import { ObjectId } from "mongoose";

export const deleteUserTasks = (agenda: Agenda) => {
  try {
    if (!agenda) throw new Error("delete user task job error");

    agenda.define("delete user tasks", async (job: Job) => {
      const userId = job.attrs.data as ObjectId;

      await Task.deleteMany({ userId: userId });
    });
  } catch (error) {
    console.error(error);
  }
};
