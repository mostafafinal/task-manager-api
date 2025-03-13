import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../../src/services/projectService";
import { Project } from "../../src/models/Project";
import agenda from "../../src/configs/agenda";
import { faker } from "@faker-js/faker";
import { ProjectModel } from "../../src/types/schemas";
import { Types } from "mongoose";

jest.mock("../../src/models/Project");
jest.mock("../../src/configs/agenda");

describe("project service testing", () => {
  const id: Types.ObjectId = new Types.ObjectId(
    faker.database.mongodbObjectId()
  );
  const project = {
    name: faker.commerce.productName(),
    deadline: faker.date.soon(),
    status: faker.helpers.arrayElement(["active", "completed"]),
    priority: faker.helpers.arrayElement(["low", "moderate", "high"]),
    description: faker.commerce.productDescription(),
    userId: new Types.ObjectId(faker.database.mongodbObjectId()),
  } as ProjectModel;

  test("create new project test", async () => {
    Project.create = jest.fn();

    await createProject(project);

    expect(Project.create).toHaveBeenCalledWith(project);
  });

  test("get all projects test", async () => {
    Project.find = jest.fn();

    await getProjects(id);

    expect(Project.find).toHaveBeenCalledWith({ userId: id });
  });

  test("update project test", async () => {
    const newData: Partial<ProjectModel> = {
      name: faker.commerce.productName(),
      deadline: faker.date.future(),
    };

    Project.updateOne = jest.fn();

    await updateProject(id, newData);

    expect(Project.updateOne).toHaveBeenLastCalledWith(
      { _id: id },
      { ...newData }
    );
  });

  test("delete project test", async () => {
    Project.deleteOne = jest.fn();

    agenda.now = jest.fn();

    await deleteProject(id);

    expect(Project.deleteOne).toHaveBeenCalledWith({ _id: id });
    expect(agenda.now).toHaveBeenLastCalledWith("delete project tasks", {
      projectId: id,
    });
  });
});
