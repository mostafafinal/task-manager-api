import { ErrorMiddleware } from "../types/expressMiddleware";

export const errorHandler: ErrorMiddleware = async (
  error,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next
) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    data: error.data,
    details: error.details,
  });
};
