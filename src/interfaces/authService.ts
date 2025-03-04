import { IUser } from "./schemas";

export interface RegisterUser {
  registerUser(userData: IUser): Promise<IUser>;
}

interface ILoginData {
  email: string;
  password: string
}

export interface LoginUser { 
  loginUser(userData: ILoginData): Promise<IUser>;
}