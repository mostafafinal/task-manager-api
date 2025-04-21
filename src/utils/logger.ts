/**
 * @file logger.ts
 * @author Mostafa Hasan // (mostafafinal55@gmail.com)
 * @summary
 *  This file declares httpErrorLogger & Logger utilities
 *  they are responsible for logging http error responses
 *  and regular error expections happen at any functionality
 *  with pretty and well-documented professional error!
 * @version 1.0.0
 * @date 2025-04-15
 * @copyright Copyrights (c) 2025
 */

import pino from "pino";
import { CustomError } from "./customError";
import { PinoErrorTypeEnum } from "../types/pino";
import { ENV_VARS } from "../configs/envs";

export const logger = pino({
  ...(ENV_VARS.NOD_ENV === "development" && {
    transport: {
      target: "pino-pretty",
      options: { colorize: true },
    },
  }),
});

type HttpErrorLogger = (error: CustomError) => void;

/**
 * @description
 *  HttpErrorLogger is a util that handles router hanlders' errors
 *  or in another words it handles the HTTP Response Errors
 *
 * @param error custom error object (has pino related error type e.g. info, error)
 * @log pino pretty error
 * @exception invalid pino error types
 * @example httpErrorLogger({status: "fatal", statusCode: 500, message: "internal server error", ..etc: "etc"})
 */

export const httpErrorLogger: HttpErrorLogger = (error) => {
  try {
    if (!(error.status in PinoErrorTypeEnum))
      throw new Error("error status is not include in pino error types");

    logger[error.status](error, "HTTP ERROR OCCURED!");
  } catch (error) {
    logger.error(error, "HTTP ERROR LOGGER UTIL EXCEPTION");
  }
};
