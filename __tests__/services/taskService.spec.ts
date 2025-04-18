import * as service from "../../src/services/taskService";
import { tasks } from "../../src/types/prisma";
import { faker } from "@faker-js/faker";
import { prismaMock } from "../mocks/prisma";

describe("task service testing", () => {
  const task: tasks = {
    id: faker.database.mongodbObjectId(),
    name: faker.commerce.productName(),
    deadline: faker.date.soon(),
    status: faker.helpers.arrayElement(["todo", "inProgress", "completed"]),
    priority: faker.helpers.arrayElement(["low", "moderate", "high"]),
    description: faker.commerce.productDescription(),
    projectId: faker.database.mongodbObjectId(),
    userId: faker.database.mongodbObjectId(),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.recent(),
    v: 0,
  };

  afterEach(() => jest.clearAllMocks);

  test("create new task test", async () => {
    prismaMock.tasks.create.mockResolvedValue(task);

    const createdTask = await service.createTask(task);

    expect(prismaMock.tasks.create).toHaveBeenCalled();
    expect(createdTask).toMatchObject<tasks>(task);
  });

  test("get task data", async () => {
    prismaMock.tasks.findUnique.mockResolvedValue(task);

    const returnedTask = await service.getTask(task.id);

    expect(prismaMock.tasks.findUnique).toHaveBeenCalled();
    expect(returnedTask).toMatchObject<tasks>(task);
  });

  test("update task test", async () => {
    const newData: Partial<tasks> = {
      name: faker.commerce.productName(),
      deadline: faker.date.future(),
    };

    prismaMock.tasks.update.mockResolvedValue(task);

    const updatedTask = await service.updateTask(task.id, newData);

    expect(prismaMock.tasks.update).toHaveBeenCalled();
    expect(updatedTask).toMatchObject<tasks>(task);
  });

  test("delete task test", async () => {
    prismaMock.tasks.delete.mockResolvedValue(task);

    const deletedTask = await service.deleteTask(task.id);

    expect(prismaMock.tasks.delete).toHaveBeenCalled();
    expect(deletedTask).toMatchObject<tasks>(task);
  });
});
