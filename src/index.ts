import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import indexRouter from "./routes/indexRouter";
import "./configs/passport";
import "./configs/agenda";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB = process.env.MONGO_URL as string;

// Updated CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: false }));

app.use("/", indexRouter);

// Error handling middleware
app.use(errorHandler);

mongoose
  .connect(DB, {})
  .then(() => {
    console.log("DB connected sucessfully!");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB connection error", err);
  });

export default app;
