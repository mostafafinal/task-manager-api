import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { appOpt } from "./configs/corsOpts";
import cookieParser from "cookie-parser";
import "./configs/passport";
import "./configs/agenda";
import indexRouter from "./routes/indexRouter";
import { errorHandler } from "./middlewares/errorHandler";
import { connectMongo } from "./configs/mongoose";

config();

const app = express();

app.use(cors(appOpt));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

app.use(errorHandler);

app.listen(process.env.PORT, connectMongo);

export default app;
