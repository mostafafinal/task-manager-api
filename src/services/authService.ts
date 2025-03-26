import { User } from "../models/User";
import { hashPassword, verifyPassword } from "../utils/bcryption";
import { IUser } from "../types/schemas";

type RegisterUser = (data: IUser) => Promise<void | undefined>;

export const registerUser: RegisterUser = async (userData) => {
  try {
    const isExisted = await User.checkUserByEmail(userData.email);

    if (isExisted) throw new Error("user is already existed, try to login");

    const hashedPassword = await hashPassword(userData.password);

    await User.create({
      ...userData,
      password: hashedPassword,
    });
  } catch (error) {
    console.error(error);
  }
};

type LoginUser = (data: Partial<IUser>) => Promise<IUser | undefined>;

export const loginUser: LoginUser = async (userData) => {
  try {
    const user = await User.getUser(userData.email as string);

    if (!user) throw new Error("User is not existed");

    const checkPassword = await verifyPassword(
      userData.password as string,
      user.password
    );

    if (!checkPassword) throw new Error("Password's not correct");

    return user;
  } catch (error) {
    console.error(error);
  }
};
