import { Request, Response, NextFunction } from "express";
import { users } from "./prisma";

declare module "express" {
  interface Request {
    user?: Partial<users> | undefined;
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
