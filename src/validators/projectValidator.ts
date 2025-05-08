import { body, query, ValidationChain } from "express-validator";

const errMsg = {
  project: {
    name: {
      empty: "project name is empty!",
      length: "project name should be between 2 or 100 characters!",
    },
    status: {
      empty: "project status should be determined!",
      enum: "project status should be either active or completed!",
    },
    deadline: {
      empty: "project deadline should be determined!",
      valid: "project deadline should be a valid date!",
    },
    priority: {
      empty: "project priority should be determined!",
      enum: "project priority should be low, moderate, or high!",
    },
    description: {
      empty: "project descirption shouldn't be proivided as empty space",
      length: "project description maximum has 1000 character",
    },
  },
  query: {
    page: "page query should be a vaild digit",
    limit: "limit query should be a vaild digit",
    num: "both page and limit should be a valid digits",
  },
  search: {
    empty: "no query to search with",
    string: "invalid query search",
  },
  param: "project id must be a valid id",
};

export const newProject: ValidationChain[] = [
  body("name")
    .notEmpty()
    .trim()
    .withMessage(errMsg.project.name.empty)
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage(errMsg.project.name.length)
    .bail(),
  body("status")
    .notEmpty()
    .trim()
    .withMessage(errMsg.project.status.empty)
    .bail()
    .isIn(["active", "completed"])
    .withMessage(errMsg.project.status.enum)
    .bail()
    .escape(),
  body("deadline")
    .notEmpty()
    .trim()
    .withMessage(errMsg.project.deadline.empty)
    .bail()
    .isISO8601()
    .withMessage(errMsg.project.deadline.valid)
    .bail()
    .escape(),
  body("priority")
    .notEmpty()
    .trim()
    .withMessage(errMsg.project.priority.empty)
    .bail()
    .isIn(["low", "moderate", "high"])
    .withMessage(errMsg.project.priority.enum)
    .bail()
    .escape(),
  body("description")
    .isLength({ max: 1000 })
    .withMessage(errMsg.project.description.length)
    .bail()
    .optional(),
];

export const reqQuery: ValidationChain[] = [
  query("page")
    .notEmpty()
    .trim()
    .withMessage(errMsg.query.page)
    .bail()
    .toInt()
    .isNumeric()
    .withMessage(errMsg.query.num)
    .escape()
    .optional(),
  query("limit")
    .notEmpty()
    .trim()
    .withMessage(errMsg.query.limit)
    .bail()
    .toInt()
    .isNumeric()
    .withMessage(errMsg.query.num)
    .escape()
    .optional(),
  query("search")
    .optional()
    .notEmpty()
    .trim()
    .withMessage(errMsg.search.empty)
    .bail()
    .isString()
    .withMessage(errMsg.search.string)
    .bail(),
];

export const newData: ValidationChain[] = [
  body("name")
    .notEmpty()
    .trim()
    .withMessage(errMsg.project.name.empty)
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage(errMsg.project.name.length)
    .bail()
    .optional(),
  body("status")
    .notEmpty()
    .trim()
    .withMessage(errMsg.project.status.empty)
    .bail()
    .isIn(["active", "completed"])
    .withMessage(errMsg.project.status.enum)
    .bail()
    .optional()
    .escape(),
  body("deadline")
    .notEmpty()
    .trim()
    .withMessage(errMsg.project.deadline.empty)
    .bail()
    .isISO8601()
    .withMessage(errMsg.project.deadline.valid)
    .bail()
    .optional()
    .escape(),
  body("priority")
    .notEmpty()
    .trim()
    .withMessage(errMsg.project.priority.empty)
    .bail()
    .isIn(["low", "moderate", "high"])
    .withMessage(errMsg.project.priority.enum)
    .bail()
    .optional()
    .escape(),
  body("description")
    .isLength({ max: 1000 })
    .withMessage(errMsg.project.description.length)
    .bail()
    .optional(),
];
