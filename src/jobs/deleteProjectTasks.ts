import { Agenda, Job } from "@hokify/agenda";
import { Task } from "../models/Task";
import { ObjectId } from "mongoose";

export const deleteProjectTasks = (agenda: Agenda) => {
  try {
    if (!agenda) throw new Error("delete project tasks job error");

    agenda.define("delete project tasks", async (job: Job) => {
      const projectId = job.attrs.data as ObjectId;

      await Task.deleteMany({ projectId: projectId });
    });
  } catch (error) {
    console.error(error);
  }
};
