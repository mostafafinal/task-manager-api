import { IUser } from "./schemas";

export interface RegisterUser {
    registerUser(userData: IUser): Promise<IUser>;
}
