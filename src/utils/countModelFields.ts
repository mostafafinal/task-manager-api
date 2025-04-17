/**
 * @file countModelFields.ts
 * @author Mostafa Hasan // (mostafafinal55@gmail.com)
 * @summary
 *  This file declares validateModel & countModelFields utils
 *  they are responsible for dynamically validating any existed model and its field/fields
 *  and use prisma groupBy aggregation API to count the provided model field/fields
 *  providing insights e.g.:
 *  { "0": { _count: number, field: specific data} } (for a single field)
 *  { "0": { _count: number, field A: specific data, field B: specific data} } (for multiple fields in parallel)
 *
 * @version 1.0.0
 * @date 2025-04-14
 * @copyright Copyrights (c) 2025
 */

import { prisma } from "../configs/prisma";
import { Prisma, users } from "../types/prisma";
import { logger } from "./logger";

export type ModelsFields =
  | keyof Prisma.tasksSelect
  | keyof Prisma.projectsSelect
  | keyof Prisma.usersSelect;

export type ValidateModel = (
  modelName: Prisma.TypeMap["meta"]["modelProps"],
  ...fields: ModelsFields[]
) => boolean | undefined;

/**
 * @description
 *  This util validates the provided model name and field/fields
 *  checks if the model is existed in the schema, and if
 *  the model validation passed it would check if the provided
 *  field/fields are existed in the model
 * @param modelName existed schema model name i.e. projects, tasks, users
 * @param fields model field/fields e.g. status, priority
 * @returns true if the model and its field/fields are valid
 * @throws error if either the model or its field/fields are invalid
 * @example validateModel("projects", ["status", "priority"])
 */

export const validateModel: ValidateModel = (modelName, ...fields) => {
  try {
    if (!Object.keys(Prisma.ModelName).includes(modelName))
      throw new Error("invalid model name");

    const formatedName = modelName
      .charAt(0)
      .toUpperCase()
      .concat(modelName.slice(1));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scalarFieldEnum = (Prisma as any)[`${formatedName}ScalarFieldEnum`];

    const validFields = fields.filter((field) => field in scalarFieldEnum);

    if (validFields.length !== fields.length)
      throw new Error("invalid model fields");

    return true;
  } catch (error) {
    logger.error(error, "VALIDATE MODEL UTIL EXCEPTION");
  }
};

type CountModelFields = (
  userId: users["id"],
  modelName: Prisma.TypeMap["meta"]["modelProps"],
  fields: ModelsFields[]
) => Promise<unknown>;

/**
 * @description
 *  This util uses @function validateModel util for the provided model
 *  and its field/fields validation. uses @function groupBy prisma aggrigation API
 *  to count the provided model field/fields
 *
 * @param userId user id i.e. f5481e874b20dbb1a6b8995d (for mongoDB database)
 * @param modelName existed schema model name i.e. projects, tasks, users
 * @param fields model field/fields e.g. status, priority
 * @returns { "0": { _count: number, field: specific data} } for a single field
 * @returns { "0": { _count: number, field A: specific data, field B: specific data} } in parallel
 * @example countModelFields("user-id", "projects", ["status", "priority"])
 */

export const countModelFields: CountModelFields = async (
  userId,
  modelName,
  fields
) => {
  try {
    if (!validateModel(modelName, ...fields))
      throw new Error("model validation failed");

    // @ts-expect-error signatures have been handled in the previous line
    const data = await prisma[modelName].groupBy({
      by: fields,
      _count: true,
      where: { userId: userId },
    });

    return { ...data };
  } catch (error) {
    logger.error(error, "COUNT MODEL FIELDS UTIL EXCEPTION");
  }
};
