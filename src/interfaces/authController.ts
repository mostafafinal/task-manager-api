import { Request, Response, NextFunction } from "express"

export type SignUp = (req: Request, res: Response, next: NextFunction) => Promise<void>