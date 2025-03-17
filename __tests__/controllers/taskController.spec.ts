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
      .post("/task/create")
      .set("Cookie", [`projectId=${id}`])
      .send({ task: task });

    expect(service.createTask).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("task created successfully");
    expect(res.body.data).toBeDefined();
  });

  test("get tasks request", async () => {
    (service.getTasks as jest.Mock) = jest.fn().mockResolvedValue([task, task]);

    const res: Response = await request(app)
      .get("/task")
      .set("Cookie", [`projectId=${id}`]);

    expect(service.getTasks).toHaveBeenCalledWith(id);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  test("update task request", async () => {
    const newDes = faker.commerce.productDescription();
    (service.updateTask as jest.Mock) = jest
      .fn()
      .mockResolvedValue({ ...task, description: newDes });

    const res: Response = await request(app)
      .put("/task/update")
      .set("Cookie", [`taskId=${id}`])
      .send({
        taskId: id,
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
    (service.deleteTask as jest.Mock) = jest.fn();

    const res: Response = await request(app)
      .delete("/task/delete")
      .set("Cookie", [`taskId=${id}`]);

    expect(service.deleteTask).toHaveBeenCalledWith(id);
    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBeDefined();
  });
});
