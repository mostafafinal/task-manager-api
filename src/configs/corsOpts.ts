import { CorsOptions } from "cors";
import { ENV_VARS } from "./envs";

export const appOpt: CorsOptions = {
  origin: ENV_VARS.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
