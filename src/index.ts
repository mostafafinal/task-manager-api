import express from "express";
import cors from "cors";
import { appOpt } from "./configs/corsOpts";
import cookieParser from "cookie-parser";
import "./configs/passport";
import indexRouter from "./routes/indexRouter";
import { errorHandler } from "./middlewares/errorHandler";
import { ENV_VARS } from "./configs/envs";
import { errorLogger } from "./middlewares/errorLogger";

const app = express();

app.use(cors(appOpt));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

app.use(errorLogger, errorHandler);

app.listen(ENV_VARS.PORT, () => console.log("connected"));

export default app;
