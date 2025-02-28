import { RegisterUser } from "../interfaces/authService";
import { User } from "../models/User";
import { hashPassword } from "../utils/bcryption";

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
