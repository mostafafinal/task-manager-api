import { SignJWT } from "jose";
import { RegularMiddleware } from "../interfaces/expressMiddleware";

export const signToken: RegularMiddleware = async (req, res, next) => {
  try {
    if (!req.user) throw new Error("user data're not found");

    const payload = {
      email: req.user?.email as string,
    };

    const enconder = new TextEncoder();
    const secretKey = enconder.encode(process.env.JWT_SECRET);

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secretKey);

    res.json({ token });
  } catch (err) {
    next(err);
  }
};
