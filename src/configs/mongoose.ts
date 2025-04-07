import { connect } from "mongoose";
import { config } from "dotenv";

config();

export const connectMongo = async () => {
  try {
    await connect(process.env.MONGO_URL as string);

    console.log("database connected successfully!");
  } catch (error) {
    console.log("database connection failed!");
    console.error(error);
  }
};
