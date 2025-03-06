import { model, Schema } from "mongoose";
import { TaskModel } from "../types/schemas";

const taskSchema = new Schema<TaskModel>(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
    },
    status: {
      type: String,
      required: [true, "Project status is required"],
    },
    priority: {
      type: String,
      required: [true, "The project should be priortized"],
    },
    description: {
      type: String,
      required: false,
    },
    deadline: {
      type: Date,
      required: [true, "The project should has a deadline"],
    },
  },
  { timestamps: true }
);

export const Task = model<TaskModel>("Task", taskSchema);
