import { Request, Response, NextFunction } from "express";
import { users } from "./prisma";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: Partial<users>;
    }
  }
}

export type RegularMiddlewareWithoutNext = (
  req: Request,
  res: Response
) => Promise<void>;

export type RegularMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
