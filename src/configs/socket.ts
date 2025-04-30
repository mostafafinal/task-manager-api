/**
 * @file socket.ts
 * @author Naira Mohammed Farouk
 * @summary
 *  This file defines and exports the `setupSocket` function, which initializes the Socket.IO
 *  server on top of an existing HTTP server.
 * 
 *  It also establishes a WebSocket connection with the frontend, listens for events like 
 *  "ask-gemini", and returns AI-generated responses using Gemini via the retry logic.
 * 
 * @version 2.1.0
 * @date 2025-04-30
 */

import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { retryGeminiResponse } from "../utils/gemini";
import { appOpt } from "./corsOpts";
import { errorLogger } from "../utils/logger";

/**
 * Sets up the Socket.IO server and its event handlers.
 * 
 * @param {HttpServer} server - The HTTP server to attach Socket.IO to.
 * @returns {Server} - The configured Socket.IO server instance.
 */


export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, { cors: appOpt });

  io.on("connection", (socket) => {
    socket.on("ask-gemini", async ({ message }) => {
      try {
        const response = await retryGeminiResponse(message);
        socket.emit("gemini-response", { response });
      } catch (err) {
        errorLogger("Gemini socket error:", err);
        socket.emit("gemini-response", {
          response: "_Sorry, Gemini is temporarily unavailable. Please try again later._",
        });
      }
    });

    socket.on("disconnect", () => {
    });
  });

  return io;
};
