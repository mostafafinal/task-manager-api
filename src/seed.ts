import { users, projects, tasks } from "../types/prisma";
import { faker } from "@faker-js/faker";
import { prisma } from "./configs/prisma";
import { hashPassword } from "./utils/bcryption";

// forgot that fakerjs has a similar helper!
// const randomizer = (
//   arrOfElements: string[],
//   elementsNumToReturn?: number
// ): string | string[] | undefined => {
//   try {
//     if (!arrOfElements || arrOfElements.length <= 0)
//       throw new Error("Either invalid array type or empty array");

//     if (elementsNumToReturn) {
//       const returnedElements: string[] = [];

//       for (let i = 0; i < elementsNumToReturn; i++) {
//         returnedElements.push(
//           arrOfElements[Math.floor(Math.random() * arrOfElements.length)]
//         );
//       }

//       return returnedElements;
//     }

//     return arrOfElements[Math.floor(Math.random() * arrOfElements.length)];
//   } catch (error) {
//     console.error(error);

//     process.exit(0);
//   }
// };

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
          password: await hashPassword("12345678"),
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
