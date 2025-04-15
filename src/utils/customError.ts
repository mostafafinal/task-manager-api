/**
 * @file customError.ts
 * @author Mostafa Hasan // (mostafafinal55@gmail.com)
 * @summary
 *  This file declares customError util
 *  it's responsible for handling any http errors and send a JSON HTTP
 *  customized error response e.g.:
 *  { status: fail, statusCode: 500, data: internal server error, details: ..etc}
 * @version 1.0.0
 * @date 2025-04-04
 * @copyright Copyrights (c) 2025
 */

import { PinoErrorType, PinoErrorTypeEnum } from "../types/pino";
import { logger } from "./logger";

export interface CustomError extends Error {
  status: PinoErrorType;
  statusCode: number;
  data: unknown;
  details: unknown;
}

/**
 * @description
 *  CustomError inherits Error Constractuor and adds
 *  custom error properties for it. finallay it returns
 *  the customized error to be used in multiple cases
 *  e.g. router handlers, global handlers.
 * @param status i.e. "info" | "error" | "fatal"
 * @default "fatal"
 * @param statusCode HTTP error status code i.e. 500, 400, 401, 404
 * @param message error massage e.g. enternal server error
 * @param data e.g. error data related or null
 * @param details e.g. error datails for development help or null
 * @returns { status: fail, statusCode: 500, data: internal server error, details: ..etc} JSON HTTP Error
 * @example customError("fatal", "500", "internal server error")
 */

export const customError = (
  status: PinoErrorType,
  statusCode: number = 500,
  message: string = "internal server error",
  data: unknown = null,
  details: unknown = null
) => {
  try {
    if (!(status in PinoErrorTypeEnum)) throw new Error("invalid error status");

    const error: CustomError = Object.assign(new Error(message), {
      status: status,
      statusCode: statusCode,
      data: data,
      details: details,
    });

    return error;
  } catch (error) {
    logger.error(error, "CUSTOM ERROR UTIL EXCEPTION");
  }
};
