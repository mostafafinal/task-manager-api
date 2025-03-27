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
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },
    priority: {
      type: String,
      required: [true, "The project should be priortized"],
      enum: ["low", "moderate", "high"],
      default: "moderate",
    },
    description: {
      type: String,
      required: false,
    },
    deadline: {
      type: Date,
      required: [true, "The project should has a deadline"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

export const Task = model<TaskModel>("Task", taskSchema);
