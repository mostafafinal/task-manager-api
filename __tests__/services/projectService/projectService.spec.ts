import { prismaMock } from "../../mocks/prisma";
import * as service from "../../../src/services/projectService/projectService";
import { faker } from "@faker-js/faker";
import { projects } from "../../../src/types/prisma";

describe("project service testing", () => {
  const project: projects = {
    id: faker.database.mongodbObjectId(),
    name: faker.commerce.productName(),
    deadline: faker.date.soon(),
    status: faker.helpers.arrayElement(["active", "completed"]),
    priority: faker.helpers.arrayElement(["low", "moderate", "high"]),
    description: faker.commerce.productDescription(),
    userId: faker.database.mongodbObjectId(),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.recent(),
    v: 0,
  };

  afterEach(() => jest.clearAllMocks());

  test("create new project test", async () => {
    prismaMock.projects.create.mockResolvedValue(project);

    const createdProject = await service.createProject(project);

    expect(prismaMock.projects.create).toHaveBeenCalled();
    expect(createdProject).toBe(createdProject);
  });

  test("get all projects test", async () => {
    const countedProjects = 100;
    const limit: number = 10;
    const page: number = 2;
    const pagesNum: number = countedProjects / limit;

    prismaMock.projects.count.mockResolvedValue(countedProjects);
    prismaMock.projects.findMany.mockResolvedValue([project, project]);

    const projects = await service.getProjects(project.id, page, limit);

    expect(prismaMock.projects.findMany).toHaveBeenCalled();
    expect(projects).toStrictEqual({
      projects: [project, project],
      pages: pagesNum,
    });
  });

  test("query project data", async () => {
    const queryMock = "querying projects...";
    const userIdMock = faker.database.mongodbObjectId();

    prismaMock.projects.findMany.mockResolvedValue([project]);

    const query = await service.findProjects(userIdMock, queryMock);

    expect(prismaMock.projects.findMany).toHaveBeenCalled();
    expect(query).toStrictEqual([project]);
  });

  test("get project data", async () => {
    prismaMock.projects.findUnique.mockResolvedValue(project);

    const returnedProject = await service.getProject(project.id);

    expect(prismaMock.projects.findUnique).toHaveBeenCalled();
    expect(returnedProject).toMatchObject<projects>(project);
  });

  test("update project", async () => {
    const newData: Partial<projects> = {
      name: faker.commerce.productName(),
      deadline: faker.date.future(),
    };

    prismaMock.projects.update.mockResolvedValue(project);

    const updatedProject = await service.updateProject(project.id, newData);

    expect(prismaMock.projects.update).toHaveBeenCalled();
    expect(updatedProject).toMatchObject<projects>(project);
  });

  test("delete project", async () => {
    prismaMock.projects.delete.mockResolvedValue(project);

    const deletedProject = await service.deleteProject(project.id);

    expect(prismaMock.projects.delete).toHaveBeenCalled();
    expect(deletedProject).toMatchObject<projects>(project);
  });
});
