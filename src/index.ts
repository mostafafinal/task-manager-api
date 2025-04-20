import express from "express";
import helmet from "helmet";
import cors from "cors";
import { appOpt } from "./configs/corsOpts";
import cookieParser from "cookie-parser";
import "./configs/passport";
import indexRouter from "./routes/indexRouter";
import { errorHandler } from "./middlewares/errorHandler";
import { ENV_VARS } from "./configs/envs";
import { errorLogger } from "./middlewares/errorLogger";
import chatRoutes from "./routes/chat";
import { setupSocket } from "./socket";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app); 

app.use(helmet());
app.use(cors(appOpt));

app.use(express.json());
app.use("/api", chatRoutes);
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

app.use(errorLogger, errorHandler);

// Socket.io setup
setupSocket(httpServer);

httpServer.listen(ENV_VARS.PORT, () => console.log("connected"));

export default app;
