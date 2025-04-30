/**
 * @file gemini.ts
 * @summary Utility for interacting with Google Gemini API with retries and error logging.
 * @author 
 * @version 2.0.0
 */

import { genAI, GEMINI_MODEL } from "../configs/gemini";
import { logger } from "../utils/logger";

// Types
type GeminiResponse = Promise<string>;

/**
 * Get a response from Gemini AI using plain text input.
 */

export const getGeminiResponse = async (message: string): GeminiResponse => {
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
    });

    const response = result?.response;
    const text = response?.text?.();

    if (!text) {
      throw new Error("No response text returned from Gemini");
    }

    return text;
  } catch (error) {
    logger.error( error , "Gemini API error");
    throw new Error("Failed to fetch a response from Gemini");
  }
};

/**
 * Retry Gemini API response with exponential backoff on certain errors.
 */
export const retryGeminiResponse = async (
  message: string,
  retries = 3,
  delay = 1000
): GeminiResponse => {
  try {
    return await getGeminiResponse(message);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const isOverload =
      err?.message?.includes("503") || err?.message?.includes("overloaded");

    if (retries === 0 || !isOverload) throw err;

    logger.error(err, `Retrying Gemini in ${delay}ms...`);
    await new Promise((res) => setTimeout(res, delay));
    return retryGeminiResponse(message, retries - 1, delay * 2);
  }
};
