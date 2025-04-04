import { customError, CustomError } from "../../src/utils/customError";

test("Custom error", async () => {
  const errorMock: Partial<CustomError> = {
    status: "fail",
    statusCode: 400,
    message: "invalid data",
    data: null,
    details: null,
  };

  const error: CustomError = customError(
    errorMock.status,
    errorMock.statusCode,
    errorMock.message,
    errorMock.data,
    errorMock.details
  );

  expect(error).toMatchObject<Partial<CustomError>>(errorMock);
});
