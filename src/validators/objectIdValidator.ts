import { body, param, ValidationChain } from "express-validator";

export const validateUserId: ValidationChain = body("userId")
  .customSanitizer((_, { req }) => req.user?.id)
  .isMongoId()
  .withMessage("invalid user id")
  .bail()
  .escape();

export const validateParamId: ValidationChain = param("id")
  .isMongoId()
  .withMessage("invalid parameter id")
  .bail()
  .escape();
