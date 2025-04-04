export interface CustomError extends Error {
  statusCode: number;
  data: unknown;
  details: unknown;
}

export const customError = (
  statusCode: number = 500,
  message: string = "internal server error",
  data: unknown = null,
  details: unknown = null
) => {
  const error: CustomError = Object.assign(new Error(message), {
    statusCode: statusCode,
    data: data,
    details: details,
  });

  return error;
};
