import { ErrorRequestHandler } from "express";
import { httpErrorLogger } from "../utils/logger";

export const errorLogger: ErrorRequestHandler = async (
  error,
  req,
  res,
  next
) => {
  httpErrorLogger(error);

  next(error);
};
