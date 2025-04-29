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
 * @version 2.0.0
 * @date 2025-04-29
 */

import { Server as HttpServer } from "http";
import { Server } from "socket.io";

// import { getGeminiResponse } from "./utils/gemini";
import { ENV_VARS } from "./configs/envs";
import { retryGeminiResponse } from "./utils/gemini";

/**
 * @description
 *  Initializes a Socket.IO server with CORS configured based on environment variables.
 *  It listens for incoming connections and handles events such as "ask-gemini" to get a response
 *  from the Gemini API. If Gemini API is unavailable, retries are handled using `retryGeminiResponse`.
 * 
 * @param {HttpServer} server - The existing HTTP server to attach the Socket.IO server to.
 * @returns {Server} - The initialized Socket.IO server instance.
 * 
 * @events
 *  @event connection - Triggered when a client connects to the server.
 *  @event ask-gemini - Triggered when the client sends a message to get a response from Gemini.
 *  @event gemini-response - Triggered when a response is successfully received from Gemini.
 *  @event disconnect - Triggered when the client disconnects.
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
        const response = await retryGeminiResponse(message);
        socket.emit("gemini-response", { response });
      } catch (err) {
        console.error("Gemini error:", err);
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
