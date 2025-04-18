import request, { Response } from "supertest";
import app from "../../src/index";
import { faker } from "@faker-js/faker";
import * as service from "../../src/services/taskService";
import { tasks } from "../../src/types/prisma";
import { ENV_VARS } from "../../src/configs/envs";

jest.mock("../../src/services/taskService");

describe("Task controller testing", () => {
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

  afterAll(() => jest.clearAllMocks());

  test("create task request", async () => {
    jest.spyOn(service, "createTask").mockResolvedValue(task);

    const res: Response = await request(app)
      .post("/tasks")
      .set("Cookie", `x-auth-token=${ENV_VARS.JWT_SIGNED_TOKEN}`)
      .send({ ...task });

    expect(service.createTask).toHaveBeenCalled();
    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBeDefined();
    expect(res.body.message).toBeDefined();
    expect(res.body.data).toBeDefined();
  });

  test("get task by id request", async () => {
    jest.spyOn(service, "getTask").mockResolvedValue(task);

    const res: Response = await request(app)
      .get(`/tasks/${task.id}`)
      .set("Cookie", `x-auth-token=${ENV_VARS.JWT_SIGNED_TOKEN}`);

    expect(service.getTask).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBeDefined();
    expect(res.body.data).toBeDefined();
  });

  test("update task request", async () => {
    const newDes = faker.commerce.productDescription();
    jest.spyOn(service, "updateTask").mockResolvedValue(task);

    const res: Response = await request(app)
      .put(`/tasks/${task.id}`)
      .set("Cookie", `x-auth-token=${ENV_VARS.JWT_SIGNED_TOKEN}`)
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
    jest.spyOn(service, "deleteTask").mockResolvedValue(task);

    const res: Response = await request(app)
      .delete(`/tasks/${task.id}`)
      .set("Cookie", `x-auth-token=${ENV_VARS.JWT_SIGNED_TOKEN}`);

    expect(service.deleteTask).toHaveBeenCalled();
    expect(res.statusCode).toEqual(204);
  });
});
