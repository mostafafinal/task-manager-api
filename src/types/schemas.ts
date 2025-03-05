import { Model } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserModel extends Model<IUser> {
  checkUserByEmail(email: string): Promise<boolean>;
  getUser(email: string): Promise<IUser>;
}
