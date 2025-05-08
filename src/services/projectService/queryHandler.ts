/**
 * @file queryHandler.ts
 * @author Mostafa Hasan // (mostafafinal55@gmail.com)
 * @summary
 *  This file declares queryHandler project service util
 *  responsible for handling user projects query e.g. search,
 *  pagination, filter, etc
 * @version 1.0.0
 * @date 2025-05-08
 * @copyright Copyrights (c) 2025
 */

import { projects } from "../../types/prisma";
import { logger } from "../../utils/logger";
import { getProjects, findProjects } from "./projectService";

export interface Query {
  userId: string;
  search: string;
  page: number;
  limit: number;
}

interface Registry {
  condition: (query: Query) => boolean;
  handler: (query: Query) => unknown;
}

/**
 * @description
 *  Registry is an array of registered services used
 *  by the query handler projects service util for
 *  determining which handler should be picked
 */
const registry: Registry[] = [
  {
    condition: (query: Query) => !query.search,
    handler: (query: Query) =>
      getProjects(query.userId, query.page | 1, query.limit | 10),
  },
  {
    condition: (query: Query) => !!query.search,
    handler: (query: Query) => findProjects(query.userId, query.search),
  },
];

export type QueryHandler = (query: Query) => Promise<projects[] | undefined>;

/**
 * @description
 *  QueryHandler project service util responsible for
 *  determining the right handler to be used for the
 *  provided query e.g. search handler, filter handler
 * @private
 *  A handlers internal registry would be used
 *  for the process of matching handlers with
 *  the provided query
 * @param query e.g. search, pagination, filter query object
 * @returns a matched handler for the provided query
 */
export const queryHandler = async (query: Query) => {
  try {
    if (!query) throw new Error("query is not provided");

    const matchedRegistry = registry.find((item) => item.condition(query));

    return matchedRegistry?.handler(query);
  } catch (error) {
    logger.error(error, "QUERY HANDLER SERVICE UTIL EXCEPTION");
  }
};
