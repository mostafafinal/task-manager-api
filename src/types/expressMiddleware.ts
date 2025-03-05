import { Request, Response, NextFunction } from "express";
import { IUser } from "./schemas";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export type RegularMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;
