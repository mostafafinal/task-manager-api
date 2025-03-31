import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import * as token from "../../src/utils/token";

describe("Token util suite", () => {
  afterEach(() => jest.clearAllMocks());

  const secretMock: Secret = "secret-mock";
  const payloadMock: JwtPayload = {
    id: "mock-id",
  };

  test("generate token", async () => {
    jest.spyOn(jwt, "sign").mockResolvedValue("token-mock" as never);

    const generatedToken = await token.generateToken(payloadMock, secretMock);

    expect(jwt.sign).toHaveBeenCalled();
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
