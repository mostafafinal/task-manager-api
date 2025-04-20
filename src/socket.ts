/**
 * @file socket.ts
 * @author Naira Mohammed Farouk
 * @summary
 *  This file defines the exports the `setupSocket` function which initializes Socket.IO
 *  server on top of exisiting HTTP server
 * 
 *  It also establishes a websocket connection with frontend, listens for events like a prompt and returns
 *  AI generated response using GEMINI
 * 
 * @version 1.0.0
 * @date 2025-04-19
 */

import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { getGeminiResponse } from "./utils/gemini";
import { ENV_VARS } from "./configs/envs";

/**
 * @description
 * Initializes a Socket.IO server with CORS cofigured based on environment variables.
 * It listens for incoming connections and handles events such as "ask-gemini" to get a response from the Gemini API.
 * Using `getGeminiResponse`
 * @param server - The existing HTTP server to attach the Socket.IO server to.
 * @returns {Server} - The initialized Socket.IO server instance.
 * 
 * @events
 *  @event connection - Triggered when client connects.
 *  @event ask-gemini - Triggered when client sends a message to get a response from Gemini.
 *  @event gemini-response - Triggered when a response is received from Gemini.
 *  @event disconnect - Triggered when client disconnects.
 * 
 * @example
 *  const httpServer = createServer(app);
 *  const io = setupSocket(httpServer);
 *  httpServer.listen(3000, () => console.log("Server running on port 3000"));
 */

export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: ENV_VARS.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
      methods: ["GET", "POST"]
    },
  });

  io.on("connection", (socket) => {
    socket.on("ask-gemini", async ({ message }) => {
      try {
        const response = await getGeminiResponse(message);
        socket.emit("gemini-response", { response });
      } catch (error) {
        console.error("Gemini error:", error);
        socket.emit("gemini-response", { response: "⚠️ Gemini failed to respond." });
      }
    });

    socket.on("disconnect", () => {
    });
  });

  return io;
};
