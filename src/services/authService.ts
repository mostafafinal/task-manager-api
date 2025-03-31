import { User } from "../models/User";
import { hashPassword, verifyPassword } from "../utils/bcryption";
import { IUser } from "../types/schemas";
import { generateToken } from "../utils/token";
import { Secret } from "jsonwebtoken";
import { resetPasswordEmail } from "../utils/mail";

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

export const forgetPassword = async (userEmail: string) => {
  try {
    if (!userEmail) throw new Error("user email's not provided");

    const userId = await User.findOne({ email: userEmail }).select("_id");

    const token = await generateToken(
      { id: userId },
      process.env.JWT_SECRET as Secret
    );

    const domain: string = `${process.env.REDIRECT_DOMAIN}/user/resetpassword/${token}`;

    await resetPasswordEmail(
      process.env.EMAIL_SENDER as string,
      userEmail,
      domain
    );
  } catch (error) {
    console.error(error);
  }
};
