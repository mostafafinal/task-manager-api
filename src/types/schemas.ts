import { Document, Model, ObjectId } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  projects?: ObjectId[];
}

export interface UserModel extends Model<IUser> {
  checkUserByEmail(email: string): Promise<boolean>;
  getUser(email: string): Promise<IUser>;
}

export interface TaskModel extends Document {
  name: string;
  status: string;
  deadline: Date;
  priority: string;
  description?: string;
  projectId: ObjectId;
}

export interface ProjectModel extends Document {
  name: string;
  deadline: Date;
  status: string;
  priority: string;
  description?: string;
  userId: ObjectId;
  tasks?: ObjectId[];
}
