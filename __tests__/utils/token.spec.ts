import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import * as token from "../../src/utils/token";

describe("Token util suite", () => {
  afterEach(() => jest.clearAllMocks());

  const secretMock: Secret = "secret-mock";
  const payloadMock: JwtPayload = {
    id: "mock-id",
  };
  const optionMock: SignOptions = {
    algorithm: "HS256",
    expiresIn: "5m",
  };

  test("generate token", async () => {
    jest.spyOn(jwt, "sign").mockResolvedValue("token-mock" as never);

    const generatedToken = await token.generateToken(
      payloadMock,
      secretMock,
      optionMock
    );

    expect(jwt.sign).toHaveBeenCalledWith(payloadMock, secretMock, optionMock);
    expect(generatedToken).toBe("token-mock");
  });

  test("verify token", async () => {
    const tokenMock = "token-mock";

    jest.spyOn(jwt, "verify").mockResolvedValue(payloadMock as never);

    const validToken = await token.verifyToken(tokenMock, secretMock);

    expect(jwt.verify).toHaveBeenCalled();
    expect(validToken).toMatchObject(payloadMock);
  });
});
