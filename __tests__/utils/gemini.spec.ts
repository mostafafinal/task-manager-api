import { getGeminiResponse } from "../../src/utils/gemini";
import { Server } from "socket.io";
import { createServer, Server as HttpServer } from "http";
import ioClient from "socket.io-client";
import dotenv from "dotenv";

dotenv.config();

jest.mock("@google/generative-ai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

describe("WebSocket Testing for getGeminiResponse", () => {
  let ioServer: Server, httpServer: HttpServer, clientSocket: ReturnType<typeof ioClient>;
  let port: number;

  beforeEach(async () => {
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: async () => ({
          response: {
            text: () => "Mock Gemini response",
          },
        }),
      }),
    }));

    httpServer = createServer();
    ioServer = new Server(httpServer, {
      cors: { origin: "*" },
    });

    // Register connection listener *before* listening
    ioServer.on("connection", (socket) => {
      socket.on("ask-gemini", async ({ message }) => {
        try {
          const response = await getGeminiResponse(message);
          socket.emit("gemini-response", { response });
        } catch (err) {
          socket.emit("gemini-response", { response: "⚠️ Gemini failed to respond." });
        }
      });
    });

    await new Promise<void>((resolve) =>
      httpServer.listen(() => {
        port = (httpServer.address() as any).port;
        resolve();
      })
    );

    clientSocket = ioClient(`http://localhost:${port}`, {
      transports: ["websocket"],
      forceNew: true,
      reconnection: false,
    });

    await new Promise<void>((resolve) => {
      clientSocket.on("connect", () => {
        console.log("✅ Client connected");
        resolve();
      });
    });

    jest.clearAllMocks();
  });

  afterEach(() => {
    ioServer.close();
    clientSocket.close();
    httpServer.close();
  });

  it("should return a valid response over WebSocket", (done) => {
    clientSocket.emit("ask-gemini", { message: "Hello" });

    clientSocket.on("gemini-response", (data: { response: string }) => {
      expect(data.response).toBe("Mock Gemini response");
      done();
    });
  });

  it("should handle error if Gemini returns no text", (done) => {
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: async () => ({
          response: {
            text: () => undefined,
          },
        }),
      }),
    }));

    clientSocket.emit("ask-gemini", { message: "Hello" });

    clientSocket.on("gemini-response", (data: { response: string }) => {
      expect(data.response).toBe("⚠️ Gemini failed to respond.");
      done();
    });
  });

  it("should handle failure if Gemini API fails", (done) => {
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: async () => {
          throw new Error("Simulated API failure");
        },
      }),
    }));

    clientSocket.emit("ask-gemini", { message: "Hello" });

    clientSocket.on("gemini-response", (data: { response: string }) => {
      expect(data.response).toBe("⚠️ Gemini failed to respond.");
      done();
    });
  });
});
