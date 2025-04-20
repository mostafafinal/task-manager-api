/**
 * @file geminiValidator.ts
 * @author Naira Mohammed Farouk
 * @summary
 *  This file defines a validation middleware that checks the validity of the user's message 
 *  in the incoming request. It ensures that the message is a non-empty string.
 * 
 * @version 1.0.0
 * @date 2025-04-29
 */

import { body } from 'express-validator';
/**
 * @description
 *  This is an array of express-validator middleware functions used to validate 
 *  the `message` field from the request body. It ensures that the `message` is a non-empty 
 *  string before it is sent to the Gemini API for processing.
 * 
 * @returns {Array} - An array of express-validator middleware functions to validate the request body.
 */

export const validateMessage = [
  body('message')
    .isString()
    .withMessage('Message must be a string.')
    .notEmpty()
    .withMessage('Message cannot be empty.')
];
