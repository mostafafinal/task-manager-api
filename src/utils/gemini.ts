/**
 * @file gemini.ts
 * @author Naira Mohammed Farouk
 * @summary
 *  This file exports the utility function `getGeminiResponse` for interacting with
 *  the Google Gemini API (Gemini 2.0 Flash) and provides the `retryGeminiResponse`
 *  function to handle retries with exponential backoff in case of API errors.
 * 
 *  Handles potential API and networking errors and provides appropriate fallbacks
 *  and error messages.
 * 
 * @version 1.0.0
 * @date 2025-04-29
 */


import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

/**
 * @description
 *  Async function utilizes the google gemini model to generate a response in plain text.
 *  Prepares a prompt structure, communicates with the API, and returns the generated text.
 *  Handles errors and logs them to the console.
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

/**
 * @description
 *  Wrapper function for `getGeminiResponse` that retries the request in case of certain API errors
 *  (e.g., 503 Service Unavailable). Implements exponential backoff to prevent overwhelming the API 
 *  when it's overloaded.
 * 
 *  The function will attempt to get a response up to `retries` times, with the delay between attempts doubling
 *  after each retry (exponential backoff).
 * 
 * @param {string} message - The input message to be sent to the Gemini API.
 * @param {number} retries - The number of retry attempts before failing (default: 3).
 * @param {number} delay - The initial delay in milliseconds between retries (default: 1000ms).
 * @returns {Promise<string>} - A promise that resolves to the generated response text.
 * 
 * @throws {Error} - Throws an error if the API call fails or if no response text is returned after retries.
 * 
 * @example
 * const response = await retryGeminiResponse("Tell me a joke.", 3, 1000);
 * console.log(response); // Output: "Why don’t skeletons fight each other? They don’t have the guts!"
 */

export const retryGeminiResponse = async (
  message: string,
  retries = 3,
  delay = 1000
): Promise<string> => {
  try {
    return await getGeminiResponse(message);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const isOverload = err.message.includes("503") || err.message.includes("overloaded");
    if (retries === 0 || !isOverload) {
      throw err;
    }

    console.warn(`Retrying Gemini in ${delay}ms...`);
    await new Promise((res) => setTimeout(res, delay));
    return retryGeminiResponse(message, retries - 1, delay * 2); // exponential backoff
  }
};

