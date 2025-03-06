import { model, Schema } from "mongoose";
import { ProjectModel } from "../types/schemas";

const projectSchema = new Schema<ProjectModel>(
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
    tasks: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  },
  { timestamps: true }
);

export const Project = model<ProjectModel>("Project", projectSchema);
