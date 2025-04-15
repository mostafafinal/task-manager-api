/**
 * @file tryCatch.ts
 * @author Mostafa Hasan //(mostafafinal55@gmail.com)
 * @summary
 *  This file declares a tryCatch util
 *  it's responsible for handling asynchronous
 *  router handlers exceptions
 * @version 1.0.0
 * @date 2025-04-03
 * @copyright Copyrights (c) 2025
 */

import { Request, Response, NextFunction } from "express";
import {
  RegularMiddleware,
  RegularMiddlewareWithoutNext,
} from "../types/expressMiddleware";

/**
 * @description
 *  TryCatch util handles an asynchronous router handlers'
 *  errors and passed them to the global error handler
 * @param asyncFn asynchronous router handler
 * @returns asynchronous router handler that handles the provided
 *          asynchronous router handler exceptions
 * @example tryCatch((req, res) => {
 *          // request & respone handling...
 * })
 */

export const tryCatch = (
  asyncFn: RegularMiddlewareWithoutNext
): RegularMiddleware => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await asyncFn(req, res);
    } catch (error) {
      next(error);
    }
  };
};
