/**
 * @file customError.ts
 * @author Mostafa Hasan (mostafafinal55@gmail.com)
 * @summary
 *  This file declares customError util
 *  it's responsible for handling any http errors and send a JSON HTTP
 *  customized error response e.g.:
 *  { status: fail, statusCode: 500, data: internal server error, details: ..etc}
 * @version 1.0.0
 * @date 2025-04-04
 * @copyright Copyrights (c) 2025
 */

export interface CustomError extends Error {
  status: string;
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
 * @param status
 * @param statusCode
 * @param message
 * @param data
 * @param details
 * @returns { status: fail, statusCode: 500, data: internal server error, details: ..etc} JSON HTTP Error
 */

export const customError = (
  status: string = "fail",
  statusCode: number = 500,
  message: string = "internal server error",
  data: unknown = null,
  details: unknown = null
) => {
  const error: CustomError = Object.assign(new Error(message), {
    status: status,
    statusCode: statusCode,
    data: data,
    details: details,
  });

  return error;
};
