import { model, Schema } from "mongoose";
import { IUser, UserModel } from "../interfaces/schemas";

const userSchema = new Schema<IUser, UserModel>({
  firstName: {
    type: String,
    required: [true, "first name is required"],
  },
  lastName: {
    type: String,
    required: [true, "last name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email is already existed"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
});

userSchema.static(
  "checkUserByEmail",
  async function checkUserByEmail(userEmail: string): Promise<boolean> {
    const user = await this.where({ email: userEmail });

    if (user) return true;

    return false;
  },
);

export const User = model<IUser, UserModel>("User", userSchema);
