import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { appOpt } from "./configs/corsOpts";
import { retryGeminiResponse } from "./utils/gemini";
import { logger } from "./utils/logger";

export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, { cors: appOpt });

  io.on("connection", (socket) => {
    socket.on("ask-gemini", async ({ message }) => {
      try {
        const response = await retryGeminiResponse(message);

        socket.emit("gemini-response", { response });
      } catch (err) {
        logger.error(err, "Gemini socket error");

        socket.emit("gemini-response", {
          response:
            "_Sorry, Gemini is temporarily unavailable. Please try again later._",
        });
      }
    });

    socket.on("disconnect", () => logger.info({}, "socket is disconnected"));
  });

  return io;
};
