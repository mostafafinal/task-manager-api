import { RegularMiddlewareWithoutNext } from "../types/expressMiddleware";

export const greeting: RegularMiddlewareWithoutNext = async (req, res) => {
  res.send("Hi, I'm working!");
};

export const notFound: RegularMiddlewareWithoutNext = async (req, res) => {
  res.status(404).json({ status: "fail", message: "Not available resources!" });
};
