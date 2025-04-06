import { body, ValidationChain } from "express-validator";
import { User } from "../models/User";

const errMsg = {
  fnLs: {
    empty: "first or last name field is empty",
    length:
      "the name should has minimun 2 characters, and maximum 10 characters",
  },
  email: {
    empty: "email field is empty",
    valid: "the email should be a valid email!",
    exist: "the email is already in use, try another one!",
    notExisted: "the email is not existed, try to signup!",
  },
  password: {
    empty: "password field is empty",
    length:
      "password should has minimun 8 characters, and maximum 30 characters",
    safe: "password should at least contain both capital & small charachter, and one special character",
  },
  confirmPassword: {
    empty: "confirm password field is empty",
    match: "passwords are not in match!",
  },
};

export const signUp: ValidationChain[] = [
  body("firstName")
    .notEmpty()
    .trim()
    .withMessage(errMsg.fnLs.empty)
    .bail()
    .isLength({ min: 2, max: 10 })
    .withMessage(errMsg.fnLs.length)
    .escape()
    .bail(),
  body("lastName")
    .notEmpty()
    .trim()
    .withMessage(errMsg.fnLs.empty)
    .bail()
    .isLength({ min: 2, max: 10 })
    .withMessage(errMsg.fnLs.length)
    .bail()
    .escape(),
  body("email")
    .notEmpty()
    .trim()
    .withMessage(errMsg.email.empty)
    .bail()
    .isEmail()
    .withMessage(errMsg.email)
    .bail()
    .custom(async (value) => {
      const isExisted = await User.checkUserByEmail(value);

      if (isExisted) throw new Error(errMsg.email.exist);
    })
    .bail()
    .escape(),
  body("password")
    .notEmpty()
    .trim()
    .withMessage(errMsg.password.empty)
    .bail()
    .isLength({ min: 8, max: 30 })
    .withMessage(errMsg.password.length)
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage(errMsg.password.safe)
    .bail()
    .escape(),
  body("confirmPassword")
    .notEmpty()
    .trim()
    .withMessage(errMsg.confirmPassword.empty)
    .bail()
    .custom((value, { req }) => value === req.body.password)
    .withMessage(errMsg.confirmPassword.match)
    .bail()
    .escape(),
];

export const login: ValidationChain[] = [
  body("email")
    .notEmpty()
    .trim()
    .withMessage(errMsg.email.empty)
    .bail()
    .isEmail()
    .withMessage(errMsg.email.valid)
    .bail()
    .escape(),
  body("password")
    .notEmpty()
    .trim()
    .withMessage(errMsg.password.empty)
    .bail()
    .isLength({ min: 8, max: 30 })
    .withMessage(errMsg.password.length)
    .bail()
    .escape(),
];

export const email: ValidationChain = body("email")
  .notEmpty()
  .trim()
  .withMessage(errMsg.email.empty)
  .bail()
  .isEmail()
  .withMessage(errMsg.email)
  .bail()
  .custom(async (value) => {
    const existed = await User.checkUserByEmail(value);

    if (!existed) throw new Error(errMsg.email.notExisted);
  })
  .bail()
  .escape();
