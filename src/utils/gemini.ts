/**
 * @file gemini.ts
 * @author Naira Mohammed Farouk
 * @summary
 *  This file exports a utility function `getGeminiResponse` that interfaces with
 *  the Google Gemini API (Gemini 2.0 Flash) to generate responses based on user input.
 * 
 *  Handles potential API and networking errors and provides appropriatefallbacks and error messages.
 * 
 * @version 1.0.0
 * @date 2025-04-21
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

/**
 * @description
 *  Async function utilizes the google gemini model to generate response in plain text response.
 * Prepares a prompt structure, communicates with API, and returns the generated text.
 * Handles errors and logs them to console.
 * 
 * @param {string} message - The input message to be sent to the Gemini API.
 * @returns {Promise<string>} - A promise that resolves to the generated response text.
 * 
 * @throws {Error} - Throws an error if the API call fails or if no response text is returned.
 * 
 * @example
 * const response = await getGeminiResponse("Tell me something to make my day.");
 * console.log(response); // Output: "Here's a positive thought: Every day may not be good, but there's something good in every day."
 */

export const getGeminiResponse = async (message: string): Promise<string> => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    const response = result?.response;
    const text = response?.text?.();

    if (!text) {
      throw new Error("No response text returned from Gemini");
    }

    return text;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Gemini API Error:", error.message);
    } else {
      console.error("Gemini API Error:", error);
    }
    throw new Error("Failed to fetch a response from Gemini");
  }
};
