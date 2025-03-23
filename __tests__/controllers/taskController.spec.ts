import request, { Response } from "supertest";
import app from "../../src/index";
import { faker } from "@faker-js/faker";
import * as service from "../../src/services/taskService";
import { TaskModel } from "../../src/types/schemas";
import { Types } from "mongoose";

jest.mock("../../src/services/taskService");

describe("Task controller testing", () => {
  const id: Types.ObjectId = new Types.ObjectId(
    faker.database.mongodbObjectId()
  );
  const task: Partial<TaskModel> = {
    name: faker.commerce.productName(),
    deadline: faker.date.soon(),
    status: faker.helpers.arrayElement(["active", "completed"]),
    priority: faker.helpers.arrayElement(["low", "moderate", "high"]),
    description: faker.commerce.productDescription(),
  };

  afterAll(() => jest.clearAllMocks());

  test("create task request", async () => {
    (service.createTask as jest.Mock) = jest.fn().mockResolvedValue(task);

    const res: Response = await request(app)
      .post("/tasks")
      .send({ projectId: id, task: task });

    expect(service.createTask).toHaveBeenCalled();
    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("task created successfully");
    expect(res.body.data).toBeDefined();
  });

  test("get task by id request", async () => {
    (service.getTask as jest.Mock) = jest.fn().mockResolvedValue(task);

    const res: Response = await request(app).get(`/tasks/${id}`);

    expect(service.getTask).toHaveBeenCalledWith(id);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeDefined();
  });

  test("update task request", async () => {
    const newDes = faker.commerce.productDescription();
    (service.updateTask as jest.Mock) = jest
      .fn()
      .mockResolvedValue({ ...task, description: newDes });

    const res: Response = await request(app)
      .put(`/tasks/${id}`)
      .send({
        newData: {
          description: newDes,
        },
      });

    expect(service.updateTask).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("task updated successfully");
  });

  test("delete task request", async () => {
    (service.deleteTask as jest.Mock) = jest.fn().mockResolvedValue(null);

    const res: Response = await request(app).delete(`/tasks/${id}`);

    expect(service.deleteTask).toHaveBeenCalled();
    expect(res.statusCode).toEqual(204);
  });
});
