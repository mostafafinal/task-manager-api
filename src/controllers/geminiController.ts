/**
 * @file geminiController.ts
 * @author Naira Mohammed Farouk
 * @summary
 *  This file contains the controller for handling messages from the user.
 *  It processes the incoming request, interacts with the Gemini API, 
 *  and sends the generated response back to the client.
 * 
 * @version 1.0.0
 * @date 2025-04-29
 */
import { Request, Response } from 'express';
import { getGeminiResponse } from '../utils/gemini';

/**
 * @description
 *  This controller function handles incoming POST requests with a message from the user.
 *  It sends the message to the Gemini API using the `getGeminiResponse` function,
 *  then returns the generated response in the API response.
 * 
 * @param {Request} req - The Express request object, which contains the user’s message in the request body.
 * @param {Response} res - The Express response object, used to send the generated Gemini response back to the client.
 * 
 * @returns {Promise<void>} - Does not return a value directly; instead, it sends a JSON response with the generated Gemini response.
 */


export const handleMessage = async (req: Request, res: Response): Promise<void> => {
  const { message } = req.body;
  const response = await getGeminiResponse(message);
  res.json({ response });
};
