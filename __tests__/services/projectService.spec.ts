import * as service from "../../src/services/projectService";
import { Project } from "../../src/models/Project";
import agenda from "../../src/configs/agenda";
import { faker } from "@faker-js/faker";
import { ProjectModel } from "../../src/types/schemas";
import { Types } from "mongoose";
import { User } from "../../src/models/User";

jest.mock("../../src/models/Project");
jest.mock("../../src/models/User");
jest.mock("../../src/configs/agenda");

describe("project service testing", () => {
  const id: Types.ObjectId = new Types.ObjectId(
    faker.database.mongodbObjectId()
  );
  const project: ProjectModel = {
    name: faker.commerce.productName(),
    deadline: faker.date.soon(),
    status: faker.helpers.arrayElement(["active", "completed"]),
    priority: faker.helpers.arrayElement(["low", "moderate", "high"]),
    description: faker.commerce.productDescription(),
    userId: new Types.ObjectId(faker.database.mongodbObjectId()),
  };

  afterEach(() => jest.clearAllMocks());

  test("create new project test", async () => {
    Project.create = jest.fn().mockResolvedValue(project);
    jest.spyOn(User, "updateOne");

    await service.createProject(project);

    expect(Project.create).toHaveBeenCalledWith(project);
    expect(User.updateOne).toHaveBeenCalled();
  });

  test("get all projects test", async () => {
    const countedProjects = 100;
    const limit: number = 10;
    const page: number = 2;
    const skippedNumOfProjects: number = (page - 1) * limit;

    const countDocumentsMock = jest.fn().mockResolvedValue(countedProjects);
    const selectMethodMock = jest.fn();

    const limitMethodMock = jest.fn().mockReturnValue({
      select: selectMethodMock,
    });
    const skipMethodMock = jest.fn().mockReturnValue({
      limit: limitMethodMock,
    });

    Project.find = jest
      .fn()
      .mockReturnValueOnce({
        countDocuments: countDocumentsMock,
      })
      .mockReturnValueOnce({
        skip: skipMethodMock,
      });

    await service.getProjects(id, page, limit);

    expect(countDocumentsMock).toHaveBeenCalled();
    expect(skipMethodMock).toHaveBeenCalledWith(skippedNumOfProjects);
    expect(limitMethodMock).toHaveBeenCalledWith(limit);
    expect(selectMethodMock).toHaveBeenCalled();
    expect(Project.find).toHaveBeenCalledTimes(2);
  });

  test("get project data", async () => {
    const populateMethodMock = jest.fn();
    Project.findById = jest.fn().mockReturnValue({
      populate: populateMethodMock,
    });

    await service.getProject(id);

    expect(Project.findById).toHaveBeenCalledWith(id);
    expect(populateMethodMock).toHaveBeenCalled();
  });

  test("update project", async () => {
    const newData: Partial<ProjectModel> = {
      name: faker.commerce.productName(),
      deadline: faker.date.future(),
    };

    Project.updateOne = jest.fn().mockResolvedValue(true);

    await service.updateProject(id, newData);

    expect(Project.updateOne).toHaveBeenLastCalledWith(
      { _id: id },
      { ...newData }
    );
  });

  test("delete project", async () => {
    Project.deleteOne = jest.fn().mockResolvedValue(true);
    jest.spyOn(User, "updateOne");

    agenda.now = jest.fn();

    await service.deleteProject(id, id);

    expect(Project.deleteOne).toHaveBeenCalledWith({ _id: id });
    expect(User.updateOne).toHaveBeenCalled();
    expect(agenda.now).toHaveBeenCalledWith("delete project tasks", id);
  });
});
