/**
 * @file geminiRouter.ts
 * @author Naira Mohammed Farouk
 * @summary
 *  This file defines the `geminiRouter`, an Express router responsible for handling the 
 *  `/message` endpoint. It routes incoming POST requests to the `handleMessage` controller 
 *  after validating the message input and handling any potential errors.
 * 
 * @version 2.0.0
 * @date 2025-04-29
 */

import { Router } from 'express';
import { handleMessage } from '../controllers/geminiController';
import { tryCatch } from '../utils/tryCatch';
import { validateMessage } from '../validators/geminiValidator';
import { validate } from '../middlewares/validate';

/**
 * @description
 *  `geminiRouter` is an Express router that handles POST requests to the `/message` endpoint. 
 *  It processes incoming requests, validates the `message` field using the `validateMessage` 
 *  middleware and the `validate` function, and routes the request to the `handleMessage` controller.
 *  It also handles errors by using the `tryCatch` wrapper for asynchronous operations.
 * 
 *  **Workflow:**
 *  1. The incoming request is validated to ensure the `message` is a valid string.
 *  2. The request is passed to the `handleMessage` controller to fetch a response from Gemini.
 *  3. Any errors are caught by `tryCatch` and handled appropriately.
 * 
 * @returns {Router} - The configured router for the Gemini message handling endpoint.
 */

const geminiRouter: Router = Router();

geminiRouter.post('/message', validateMessage, validate, tryCatch(handleMessage));

export default geminiRouter;
