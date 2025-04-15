import { ErrorMiddleware } from "../types/expressMiddleware";
import { httpErrorLogger } from "../utils/logger";

export const errorLogger: ErrorMiddleware = async (error, req, res, next) => {
  httpErrorLogger(error);

  next(error);
};
