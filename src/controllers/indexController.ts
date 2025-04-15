import { RegularMiddlewareWithoutNext } from "../types/expressMiddleware";
import { customError } from "../utils/customError";

export const launch: RegularMiddlewareWithoutNext = async (req, res) => {
  res.send("Hi, I'm working!");
};

export const notFound: RegularMiddlewareWithoutNext = async (req, res) => {
  customError("error", 404, "resources is not available");

  res
    .status(404)
    .json({ status: "error", message: "resources is not available" });
};
