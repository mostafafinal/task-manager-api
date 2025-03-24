import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/authRouter";
import projectRouter from "./routes/projectRouter";
import taskRouter from "./routes/taskRouter";
import "./configs/passport";

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

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRouter);
app.use("/projects", projectRouter);
app.use("/tasks", taskRouter);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction
  ) => {
    console.error(err.stack);

    res.status(500).json({ error: "Something broke!" });
  }
);

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
