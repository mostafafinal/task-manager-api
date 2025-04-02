import { NextFunction, Request, Response } from "express";
import { tryCatch } from "../../src/utils/tryCatch";

describe("Async error handler suite", () => {
  const requestMock = {} as Request;
  const responseMock = {} as Response;
  const nextMock = jest.fn() as NextFunction;

  afterEach(() => jest.clearAllMocks());

  test("Success case", async () => {
    const asyncCallbackFnMock: jest.Mock = jest.fn();

    const returnedMiddleWare = tryCatch(asyncCallbackFnMock);

    await returnedMiddleWare(requestMock, responseMock, nextMock);

    expect(asyncCallbackFnMock).toHaveBeenCalledWith(requestMock, responseMock);
  });

  test("Failure case", async () => {
    const asyncCallbackFnMock: jest.Mock = jest
      .fn()
      .mockRejectedValue(new Error());

    const returnedMiddleWare = tryCatch(asyncCallbackFnMock);

    await returnedMiddleWare(requestMock, responseMock, nextMock);

    expect(asyncCallbackFnMock).toHaveBeenCalledWith(requestMock, responseMock);

    expect(nextMock).toHaveBeenCalledWith(new Error());
  });
});
