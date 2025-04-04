export interface CustomError extends Error {
  status: string;
  statusCode: number;
  data: unknown;
  details: unknown;
}

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
