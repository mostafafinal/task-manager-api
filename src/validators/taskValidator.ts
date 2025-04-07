import { body, param, ValidationChain } from "express-validator";

const errMsg = {
  task: {
    name: {
      empty: "task name is empty!",
      length: "task name should be between 2 or 100 characters!",
    },
    status: {
      empty: "task status should be determined!",
      enum: "task status should be todo, in-progress, or completed!",
    },
    deadline: {
      empty: "task deadline should be determined!",
      valid: "task deadline should be a valid date!",
    },
    priority: {
      empty: "task priority should be determined!",
      enum: "task priority should be low, moderate, or high!",
    },
    description: {
      empty: "task descirption shouldn't be proivided as empty space",
      length: "task description maximum has 1000 character",
    },
    projectId: {
      empty: "project id must be provided",
      valid: "project id must be a valid id",
    },
  },
  query: {
    page: "page query should be a vaild digit",
    limit: "limit query should be a vaild digit",
    num: "both page and limit should be a valid digits",
  },
  param: "task id must be a valid id",
};

export const newtask: ValidationChain[] = [
  body("name")
    .notEmpty()
    .trim()
    .withMessage(errMsg.task.name.empty)
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage(errMsg.task.name.length)
    .bail()
    .escape(),
  body("status")
    .notEmpty()
    .trim()
    .withMessage(errMsg.task.status.empty)
    .bail()
    .isIn(["todo", "in-progress", "completed"])
    .withMessage(errMsg.task.status.enum)
    .bail()
    .escape(),
  body("deadline")
    .notEmpty()
    .trim()
    .withMessage(errMsg.task.deadline.empty)
    .bail()
    .isISO8601()
    .withMessage(errMsg.task.deadline.valid)
    .bail()
    .escape(),
  body("priority")
    .notEmpty()
    .trim()
    .withMessage(errMsg.task.priority.empty)
    .bail()
    .isIn(["low", "moderate", "high"])
    .withMessage(errMsg.task.priority.enum)
    .bail()
    .escape(),
  body("description")
    .isLength({ max: 1000 })
    .withMessage(errMsg.task.description.length)
    .bail()
    .optional()
    .escape(),
  body("projectId")
    .notEmpty()
    .trim()
    .withMessage(errMsg.task.projectId.empty)
    .bail()
    .isMongoId()
    .withMessage(errMsg.task.projectId.valid)
    .bail()
    .escape(),
];

export const paramId: ValidationChain = param("id")
  .isMongoId()
  .withMessage(errMsg.param)
  .bail()
  .escape();

export const newData: ValidationChain[] = [
  body("name")
    .notEmpty()
    .trim()
    .withMessage(errMsg.task.name.empty)
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage(errMsg.task.name.length)
    .bail()
    .optional()
    .escape(),
  body("status")
    .notEmpty()
    .trim()
    .withMessage(errMsg.task.status.empty)
    .bail()
    .isIn(["todo", "in-progress", "completed"])
    .withMessage(errMsg.task.status.enum)
    .bail()
    .optional()
    .escape(),
  body("deadline")
    .notEmpty()
    .trim()
    .withMessage(errMsg.task.deadline.empty)
    .bail()
    .isISO8601()
    .withMessage(errMsg.task.deadline.valid)
    .bail()
    .optional()
    .escape(),
  body("priority")
    .notEmpty()
    .trim()
    .withMessage(errMsg.task.priority.empty)
    .bail()
    .isIn(["low", "moderate", "high"])
    .withMessage(errMsg.task.priority.enum)
    .bail()
    .optional()
    .escape(),
  body("description")
    .isLength({ max: 1000 })
    .withMessage(errMsg.task.description.length)
    .bail()
    .optional()
    .escape(),
];
