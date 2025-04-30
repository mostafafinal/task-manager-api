/**
 * @file validate.ts
 * @author Naira Mohammed Farouk
 * @summary
 *  This file exports a middleware function `validate` that is used in an Express.js route to
 *  validate incoming request data using `express-validator`.
 *  If validation fails, it sends a 400 status code with the errors. If validation passes, 
 *  it proceeds to the next middleware.
 * 
 * @version 1.0.0
 * @date 2025-04-29
 */
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * @description
 *  This middleware function validates the request body, query, or params based on
 *  the rules defined using `express-validator`. If any validation errors are found, 
 *  it returns a 400 response with the error details.
 *  If no validation errors are found, the middleware calls `next()` to pass control 
 *  to the next route handler.
 * 
 * @param {Request} req - The Express request object, which contains the input data.
 * @param {Response} res - The Express response object, used to send a response if validation fails.
 * @param {NextFunction} next - The Express next function, used to pass control to the next middleware if validation passes.
 * 
 * @returns {void} - Does not return a value; either sends a 400 error response or proceeds to the next middleware.
 * 
 * @example
 *  // In an Express route:
 *  app.post('/submit', [body('email').isEmail(), body('password').isLength({ min: 6 })], validate, (req, res) => {
 *    res.send('Valid request!');
 *  });
 * 
 *  // If the validation fails:
 *  // { "errors": [{ "msg": "Invalid value", "param": "email", "location": "body" }] }
 * 
 * @throws {Error} - If there are validation errors in the request, it sends a 400 error with the validation errors.
 */

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
