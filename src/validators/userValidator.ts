import { body, param, ValidationChain } from "express-validator";

const errMsg = {
  passwords: {
    oldEmpty: "current password field is empty!",
    newEmpty: "new password field is empty!",
    same: "new password matches the current password",
    length:
      "password should has minimun 8 characters, and maximum 30 characters",
    safe: "password should at least contain both capital & small charachter, and one special character",
  },
  credentials: {
    emptyToken: "token is not provided!",
    match: "passwords are not in match!",
  },
};

export const passwords: ValidationChain[] = [
  body("oldPassword")
    .notEmpty()
    .trim()
    .withMessage(errMsg.passwords.oldEmpty)
    .bail()
    .isLength({ min: 8, max: 30 })
    .withMessage(errMsg.passwords.length)
    .bail(),
  body("newPassword")
    .notEmpty()
    .trim()
    .withMessage(errMsg.passwords.newEmpty)
    .bail()
    .isLength({ min: 8, max: 30 })
    .withMessage(errMsg.passwords.length)
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage(errMsg.passwords.safe)
    .bail()
    .custom((value, { req }) => value !== req.body.oldPassword)
    .withMessage(errMsg.passwords.same),
  body("confirmPassword")
    .notEmpty()
    .trim()
    .withMessage(errMsg.passwords.oldEmpty)
    .bail()
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage(errMsg.credentials.match)
    .bail()
    .escape(),
];

export const credentials: ValidationChain[] = [
  param("token")
    .notEmpty()
    .trim()
    .withMessage(errMsg.credentials.emptyToken)
    .bail()
    .escape(),
  body("newPassword")
    .notEmpty()
    .trim()
    .withMessage(errMsg.passwords.newEmpty)
    .bail()
    .isLength({ min: 8, max: 30 })
    .withMessage(errMsg.passwords.length)
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage(errMsg.passwords.safe)
    .bail()
    .escape(),
  body("confirmPassword")
    .notEmpty()
    .trim()
    .withMessage(errMsg.passwords.oldEmpty)
    .bail()
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage(errMsg.credentials.match)
    .bail()
    .escape(),
];
