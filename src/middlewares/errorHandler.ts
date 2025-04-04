import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/customError";

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    data: error.data,
    details: error.details,
  });
};
