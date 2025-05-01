import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV_VARS } from "./envs";

export const genAI = new GoogleGenerativeAI(
  ENV_VARS.GEMINI_API_KEY || "default-api-key"
);

export const model = genAI.getGenerativeModel({
  model: ENV_VARS.GEMINI_MODEL || "gemini-2.0-flash",
});
