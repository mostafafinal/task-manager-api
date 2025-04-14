import { prisma } from "../configs/prisma";
import { hashPassword, verifyPassword } from "../utils/bcryption";
import { users } from "../types/prisma";
import { generateToken } from "../utils/token";
import { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { resetPasswordEmail } from "../utils/mail";
import { ENV_VARS } from "../configs/envs";

export type RegisterUser = (data: users) => Promise<boolean | undefined>;

export const registerUser: RegisterUser = async (userData) => {
  try {
    const isExisted = await prisma.users.findUnique({
      where: { email: userData.email },
    });

    if (isExisted) throw new Error("user is already existed, try to login");

    const hashedPassword = await hashPassword(userData.password);

    const createdUser = await prisma.users.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    if (createdUser) return true;
  } catch (error) {
    console.error(error);
  }
};

type LoginUser = (data: Partial<users>) => Promise<users | undefined>;

export const loginUser: LoginUser = async (userData) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: userData.email,
      },
    });

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

export type ForgetPassword = (userEmail: string) => Promise<void>;

export const forgetPassword: ForgetPassword = async (userEmail) => {
  try {
    if (!userEmail) throw new Error("user email's not provided");

    const userId = await prisma.users.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!userId) throw new Error("user's not existed!");

    const payload: JwtPayload = userId;
    const secret = ENV_VARS.JWT_SECRET as Secret;
    const options: SignOptions = {
      algorithm: "HS256",
      expiresIn: "5d",
    };

    const token = await generateToken(payload, secret, options);

    const domain: string = `${ENV_VARS.FRONTEND_URL}/user/resetpassword/${token}`;

    await resetPasswordEmail(
      ENV_VARS.EMAIL_SENDER as string,
      userEmail,
      domain
    );
  } catch (error) {
    console.error(error);
  }
};
