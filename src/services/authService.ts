import { LoginUser, RegisterUser } from "../interfaces/authService";
import { User } from "../models/User";
import { hashPassword, verifyPassword } from "../utils/bcryption";

export const registerUser: RegisterUser["registerUser"] = async (userData) => {
  try {
    const isExisted = await User.checkUserByEmail(userData.email);

    if (isExisted) throw new Error("user is already existed, try to login");

    const hashedPassword = await hashPassword(userData.password);

    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    return user.toObject();
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const loginUser: LoginUser["loginUser"] = async (userData) => {
  try {
    const user = await User.getUser(userData.email);

    if (!user) throw new Error("User is not existed");

    const checkPassword = await verifyPassword(
      userData.password,
      user.password
    );

    if (!checkPassword) throw new Error("Password's not correct");

    return user;
  } catch (error) {
    console.error(`error`);

    throw error;
  }
};
