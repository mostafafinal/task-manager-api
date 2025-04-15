/**
 * @file seed.ts
 * @author Mostafa Hasan // (mostafafinal55@gmail.com)
 * @summary
 *  This file declares a combination of seeding funtions
 *  they are responsible for seeding a fake and demo data
 *  to the database for local development use cases
 * @version 1.0.0
 * @date 2025-04-09
 * @copyright Copyrights (c) 2025
 */

import { users, projects, tasks } from "../src/types/prisma";
import { faker } from "@faker-js/faker";
import { prisma } from "./configs/prisma";
import { hashPassword } from "./utils/bcryption";

/**
 * Randomizer util is for selecting any random element/elements
 * from a given array of elements and return it/them
 * @param arrOfElements an array of elements
 * @param elementsNumToReturn  number of random elements to be selected from the array
 * @default one element would be returned
 * @returns random element/elements
 * @example randomizer(["low", "moderate", "high"], 2)
 * @deprecated faker-js provides a similar built-in API method
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const randomizer = (
  arrOfElements: string[],
  elementsNumToReturn?: number
): string | string[] | undefined => {
  try {
    if (!arrOfElements || arrOfElements.length <= 0)
      throw new Error("Either invalid array type or empty array");

    if (elementsNumToReturn) {
      const returnedElements: string[] = [];

      for (let i = 0; i < elementsNumToReturn; i++) {
        returnedElements.push(
          arrOfElements[Math.floor(Math.random() * arrOfElements.length)]
        );
      }

      return returnedElements;
    }

    return arrOfElements[Math.floor(Math.random() * arrOfElements.length)];
  } catch (error) {
    console.error(error);

    process.exit(0);
  }
};

/**
 * @description
 *  FakeTaskData seed function seeds fake & demo tasks data
 *  for local development use cases
 * @function Prisma createMany API would be used for seeding
 *  seeding tasks' data to the database
 * @param tasksVolume number of tasks the user would have
 * @param projectId project id that own those tasks
 * @param userId user id that would own those tasks
 * @return void => tasks have been seeded
 * @throws error => invalided provided params
 * @example fakeTaskData(10, "project-id", "user-id")
 */

const fakeTaskData = async (
  tasksVolume: number,
  projectId: string,
  userId: string
) => {
  try {
    if (!projectId || !userId || !tasksVolume)
      throw new Error("missing parameters!");

    const data: tasks[] = Array.from({ length: tasksVolume }).map(() => ({
      id: faker.database.mongodbObjectId(),
      name: faker.commerce.productName(),
      deadline: faker.date.soon(),
      status: faker.helpers.arrayElement(["todo", "in-progress", "completed"]),
      priority: faker.helpers.arrayElement(["low", "moderate", "high"]),
      description: faker.commerce.productDescription(),
      projectId: projectId,
      userId: userId,
      createdAt: faker.date.anytime(),
      updatedAt: faker.date.recent(),
      v: 0,
    }));

    await prisma.tasks.createMany({ data });
  } catch (error) {
    console.error(error);

    process.exit(0);
  }
};

/**
 * @description
 *  FakeProjectData seed function seeds fake & demo projects data
 *  for local development use cases, it calls fakeTaskData function
 *  for seeding the projects' tasks
 *
 * @function fakeTaskData would be called for each project task seeding
 * @function Prisma createMany API would be used for seeding
 *  seeding projects' data to the database
 *
 * @param projectsVolume number of projects the user would have
 * @param userId user id that own those projects
 * @param tasksPerProjectVolume number of tasks that each project would have
 * @return void => projects have been generated
 * @throws error => invalided provided params
 * @example fakeProjectData(20, "user-id", 10)
 */

const fakeProjectData = async (
  projectsVolume: number,
  userId: string,
  tasksPerProjectVolume: number
) => {
  try {
    if (!projectsVolume || !userId || !tasksPerProjectVolume)
      throw new Error("missing parameters!");

    const data: projects[] = await Promise.all(
      Array.from({
        length: projectsVolume,
      }).map(async () => {
        const project: projects = {
          id: faker.database.mongodbObjectId(),
          name: faker.commerce.productName(),
          deadline: faker.date.soon(),
          status: faker.helpers.arrayElement(["active", "completed"]),
          priority: faker.helpers.arrayElement(["low", "moderate", "high"]),
          description: faker.commerce.productDescription(),
          userId: userId,
          createdAt: faker.date.anytime(),
          updatedAt: faker.date.recent(),
          v: 0,
        };

        await fakeTaskData(tasksPerProjectVolume, project.id, userId);

        return project;
      })
    );

    await prisma.projects.createMany({ data });
  } catch (error) {
    console.error(error);

    process.exit(0);
  }
};

/**
 * @description
 *  FakeUserData seed function generates fake & demo user data
 *  for local development use cases, it calls fakeProjectData
 *  seed function for seeding the users' projects
 *
 * @function Prisma createMany API would be used for seeding
 *  seeding users' data to the database
 * @function fakeProjectData would be called for each user seeding
 *
 * @param usersVolume number of users would seeded
 * @param projectsPerUserVolume number of projects would be seeded for each user
 * @param tasksPerProjectVolume  number of tasks would be seeded for each project
 * @return void => users have been seeded
 * @throws error => invalided provided params
 * @example fakeUserData(100, 20, 10)
 */

const fakeUserData = async (
  usersVolume: number,
  projectsPerUserVolume: number,
  tasksPerProjectVolume: number
) => {
  try {
    if (!usersVolume || !projectsPerUserVolume || !tasksPerProjectVolume)
      throw new Error("missing parameters!");

    const data: users[] = await Promise.all(
      Array.from({ length: usersVolume }).map(async () => {
        const user: users = {
          id: faker.database.mongodbObjectId(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          password: (await hashPassword("12345678")) as string,
          createdAt: faker.date.anytime(),
          updatedAt: faker.date.recent(),
          v: 0,
        };

        await fakeProjectData(
          projectsPerUserVolume,
          user.id,
          tasksPerProjectVolume
        );

        return user;
      })
    );

    await prisma.users.createMany({ data });
  } catch (error) {
    console.error(error);
  }
};

/**
 * @description
 *  Seed function seeds fake & demo data into local databases
 *  for local development use cases, it calls fakeUserData
 *  seed function for seeding users, projects, and tasks
 *
 * @function prisma APIs would be called for garbage collecting any old schema data
 * @function fakeUserData would be called for each users, projects, and tasks seeding
 *
 * @param usersVolume number of users would seeded
 * @param projectsPerUserVolume number of projects would be seeded for each user
 * @param tasksPerProjectVolume  number of tasks would be seeded for each project
 * @return void => database's been seeded
 * @throws error => invalided provided params or database connection
 * @example seed(100, 20, 10)
 */

const seed = async (
  usersVolume: number = 10,
  projectsPerUserVolume: number = 10,
  tasksPerProjectVolume: number = 10
) => {
  try {
    await prisma.$connect();
    console.log("DB Connected!");

    await prisma.users.deleteMany();
    await prisma.projects.deleteMany();
    await prisma.tasks.deleteMany();

    console.log("Garbage Collection :)");

    await fakeUserData(
      usersVolume,
      projectsPerUserVolume,
      tasksPerProjectVolume
    );
    console.log(
      `DB Populated!\n Your DB has ${usersVolume} user with ${projectsPerUserVolume * usersVolume} project, and ${tasksPerProjectVolume * projectsPerUserVolume * usersVolume} task!`
    );

    process.exit(0);
  } catch (err) {
    console.error(err);

    process.exit(0);
  }
};

seed(100, 5, 5);
