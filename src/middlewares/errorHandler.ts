import { ErrorRequestHandler } from "express";
import { httpErrorLogger } from "../utils/logger";

export const errorHandler: ErrorRequestHandler = async (
  error,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next
) => {
  httpErrorLogger(error);

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    data: error.data,
    details: error.details,
  });
};
