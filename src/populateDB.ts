import { connect, HydratedDocument, ObjectId } from "mongoose";
import { faker } from "@faker-js/faker";
import { User } from "./models/User";
import { Project } from "./models/Project";
import { Task } from "./models/Task";
import { IUser, ProjectModel, TaskModel } from "./types/schemas";
import { hashPassword } from "./utils/bcryption";

const uri = process.env.MONGO_URL as string;

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

const fakeTaskData = async function* (
  tasksVolume: number,
  projectId: ObjectId
) {
  try {
    if (!projectId) throw new Error("User id is not provided for tasks");

    for (let i = 0; i < tasksVolume; i++) {
      const task: HydratedDocument<TaskModel> = await Task.create({
        name: faker.commerce.productName(),
        deadline: faker.date.soon(),
        status: faker.helpers.arrayElement([
          "todo",
          "in-progress",
          "completed",
        ]),
        priority: faker.helpers.arrayElement(["low", "moderate", "high"]),
        description: faker.commerce.productDescription(),
        projectId: projectId,
      });

      yield task.id;
    }
  } catch (error) {
    console.error(error);

    process.exit(0);
  }
};

const fakeProjectData = async function* (
  projectsVolume: number,
  userId: ObjectId,
  tasksPerProjectVolume: number
) {
  try {
    if (!userId) throw new Error("User id is not provided for projects");

    for (let i = 0; i < projectsVolume; i++) {
      const project: HydratedDocument<ProjectModel> = await Project.create({
        name: faker.commerce.productName(),
        deadline: faker.date.soon(),
        status: faker.helpers.arrayElement(["active", "completed"]),
        priority: faker.helpers.arrayElement(["low", "moderate", "high"]),
        description: faker.commerce.productDescription(),
        userId: userId,
      });

      for await (const taskId of fakeTaskData(
        tasksPerProjectVolume,
        project.id
      )) {
        await project.updateOne({ $push: { tasks: taskId } });
      }

      yield project.id;
    }
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
    for (let i = 0; i < usersVolume; i++) {
      const user: HydratedDocument<IUser> = await User.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: await hashPassword("12345678"),
      });

      for await (const projectId of fakeProjectData(
        projectsPerUserVolume,
        user.id,
        tasksPerProjectVolume
      )) {
        await user.updateOne({ $push: { projects: projectId } });
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const populateDB = async (
  usersVolume: number = 10,
  projectsPerUserVolume: number = 10,
  tasksPerProjectVolume: number = 10
) => {
  try {
    await connect(uri);
    console.log("DB Connected!");

    await User.collection.drop();
    await Project.collection.drop();
    await Task.collection.drop();
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

populateDB(100, 20, 10);
