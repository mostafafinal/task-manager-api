import { Agenda, Job } from "@hokify/agenda";
import { Project } from "../models/Project";
import { ObjectId } from "mongoose";

export const deleteUserProjects = (agenda: Agenda) => {
  try {
    if (!agenda) throw new Error("delete user project job error");

    agenda.define("delete user projects", async (job: Job) => {
      const userId = job.attrs.data as ObjectId;

      await Project.deleteMany(userId);
    });
  } catch (error) {
    console.error(error);
  }
};
