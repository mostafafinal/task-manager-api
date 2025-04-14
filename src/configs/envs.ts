import { config } from "dotenv";

config();

export const ENV_VARS = {
  NOD_ENV: process.env.NOD_ENV,
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_SIGNED_TOKEN: process.env.JWT_SIGNED_TOKEN, // testing purposes
  EMAIL_SENDER_USERNAME: process.env.EMAIL_SENDER_USERNAME,
  EMAIL_SENDER_PASSWORD: process.env.EMAIL_SENDER_PASSWORD,
  EMAIL_SENDER: process.env.EMAIL_SENDER,
  FRONTEND_URL: process.env.FRONTEND_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CB_URL: process.env.GOOGLE_CB_URL,
};
