import { Model } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  projects: ProjectModel;
}

export interface UserModel extends Model<IUser> {
  checkUserByEmail(email: string): Promise<boolean>;
  getUser(email: string): Promise<IUser>;
}

export interface TaskModel {
  name: string;
  status: string;
  deadline: Date;
  priority: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectModel {
  name: string;
  deadline: Date;
  status: string;
  priority: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  tasks: TaskModel;
}
