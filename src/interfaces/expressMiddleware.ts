import { Request, Response, NextFunction } from "express"

export type RegularMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;

