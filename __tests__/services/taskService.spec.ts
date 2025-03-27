import {
  createTask,
  deleteTask,
  getTask,
  updateTask,
} from "../../src/services/taskService";
import { Task } from "../../src/models/Task";
import { faker } from "@faker-js/faker";
import { TaskModel } from "../../src/types/schemas";
import { Types } from "mongoose";
import { Project } from "../../src/models/Project";

jest.mock("../../src/models/Task");
jest.mock("../../src/models/Project");

describe("task service testing", () => {
  const id: Types.ObjectId = new Types.ObjectId(
    faker.database.mongodbObjectId()
  );
  const task: TaskModel = {
    name: faker.commerce.productName(),
    deadline: faker.date.soon(),
    status: faker.helpers.arrayElement(["active", "completed"]),
    priority: faker.helpers.arrayElement(["low", "moderate", "high"]),
    description: faker.commerce.productDescription(),
    projectId: new Types.ObjectId(faker.database.mongodbObjectId()),
  };

  afterEach(() => jest.clearAllMocks);

  test("create new task test", async () => {
    Task.create = jest.fn().mockResolvedValue(task);
    jest.spyOn(Project, "updateOne");

    await createTask(task);

    expect(Task.create).toHaveBeenCalledWith(task);
    expect(Project.updateOne).toHaveBeenCalled();
  });

  test("get task data", async () => {
    Task.findById = jest.fn().mockResolvedValue(task);

    const taskGet: TaskModel | undefined = await getTask(id);

    expect(Task.findById).toHaveBeenLastCalledWith(id);
    expect(taskGet).toMatchObject<TaskModel>(task);
  });

  test("update task test", async () => {
    const newData: Partial<TaskModel> = {
      name: faker.commerce.productName(),
      deadline: faker.date.future(),
    };

    Task.updateOne = jest.fn();

    await updateTask(id, newData);

    expect(Task.updateOne).toHaveBeenLastCalledWith(
      { _id: id },
      { ...newData }
    );
  });

  test("delete task test", async () => {
    Task.findOneAndDelete = jest.fn().mockResolvedValue(task);
    jest.spyOn(Project, "updateOne");

    await deleteTask(id);

    expect(Task.findOneAndDelete).toHaveBeenCalled();
    expect(Project.updateOne).toHaveBeenCalled();
  });
});
