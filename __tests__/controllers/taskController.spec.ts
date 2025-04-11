import request, { Response } from "supertest";
import app from "../../src/index";
import { faker } from "@faker-js/faker";
import * as service from "../../src/services/taskService";
import { prisma } from "../../src/configs/prisma";
import { tasks, users } from "../../src/types/prisma";

const prismaMock = jest.mocked(prisma);
jest.mock("../../src/services/taskService");

describe("Task controller testing", () => {
  const user: users = {
    id: faker.database.mongodbObjectId(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.recent(),
    v: 0,
  };
  const task: tasks = {
    id: faker.database.mongodbObjectId(),
    name: faker.commerce.productName(),
    deadline: faker.date.soon(),
    status: faker.helpers.arrayElement(["todo", "in-progress", "completed"]),
    priority: faker.helpers.arrayElement(["low", "moderate", "high"]),
    description: faker.commerce.productDescription(),
    projectId: faker.database.mongodbObjectId(),
    userId: faker.database.mongodbObjectId(),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.recent(),
    v: 0,
  };

  afterAll(() => jest.clearAllMocks());

  test("create task request", async () => {
    prismaMock.users.findUnique.mockResolvedValue(user);
    jest.spyOn(service, "createTask").mockResolvedValue(task);

    const res: Response = await request(app)
      .post("/tasks")
      .set("Cookie", `x-auth-token=${process.env.JWT_SIGNED_TOKEN}`)
      .send({ ...task });

    expect(service.createTask).toHaveBeenCalled();
    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBeDefined();
    expect(res.body.message).toBeDefined();
    expect(res.body.data).toBeDefined();
  });

  test("get task by id request", async () => {
    prismaMock.users.findUnique.mockResolvedValue(user);
    jest.spyOn(service, "getTask").mockResolvedValue(task);

    const res: Response = await request(app)
      .get(`/tasks/${task.id}`)
      .set("Cookie", `x-auth-token=${process.env.JWT_SIGNED_TOKEN}`);

    expect(service.getTask).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBeDefined();
    expect(res.body.data).toBeDefined();
  });

  test("update task request", async () => {
    const newDes = faker.commerce.productDescription();
    prismaMock.users.findUnique.mockResolvedValue(user);
    jest.spyOn(service, "updateTask").mockResolvedValue(task);

    const res: Response = await request(app)
      .put(`/tasks/${task.id}`)
      .set("Cookie", `x-auth-token=${process.env.JWT_SIGNED_TOKEN}`)
      .send({
        newData: {
          description: newDes,
        },
      });

    expect(service.updateTask).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBeDefined();
    expect(res.body.message).toBeDefined();
  });

  test("delete task request", async () => {
    prismaMock.users.findUnique.mockResolvedValue(user);
    jest.spyOn(service, "deleteTask").mockResolvedValue(task);

    const res: Response = await request(app)
      .delete(`/tasks/${task.id}`)
      .set("Cookie", `x-auth-token=${process.env.JWT_SIGNED_TOKEN}`);

    expect(service.deleteTask).toHaveBeenCalled();
    expect(res.statusCode).toEqual(204);
  });
});
