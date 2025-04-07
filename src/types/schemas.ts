import { Model, Types } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  projects?: Types.ObjectId[];
}

export interface UserModel extends Model<IUser> {
  checkUserByEmail(email: string): Promise<boolean>;
}

export interface TaskModel {
  name: string;
  status: string;
  deadline: Date;
  priority: string;
  description?: string;
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
}

export interface ProjectModel {
  name: string;
  deadline: Date;
  status: string;
  priority: string;
  description?: string;
  userId: Types.ObjectId;
  tasks?: Types.ObjectId[];
}
