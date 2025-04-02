import { Request, Response, NextFunction } from "express";
import {
  RegularMiddleware,
  RegularMiddlewareWithoutNext,
} from "../types/expressMiddleware";

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
