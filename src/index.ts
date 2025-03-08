import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import * as authController from "./controllers/authController";
import { signToken } from "./middlewares/jwt";
import passport from "passport";
import "./configs/passport";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB = process.env.MONGO_URL as string;

// Middleware
app.use(cors());
app.use(express.json());

app.use(urlencoded({ extended: false }));

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.post("/user/register", authController.signUp);
app.post(
  "/user/login",
  passport.authenticate("local", { session: false }),
  signToken
);
app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "authorized" });
  }
);

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
