import * as genInfo from "../../src/services/insights/utils/getGeneralInfo";
import * as countModels from "../../src/services/insights/utils/countModelFields";
import * as progress from "../../src/services/insights/utils/getProjectsProgress";
import * as service from "../../src/services/insights/insightsService";
import { faker } from "@faker-js/faker";
import { prisma } from "../../src/configs/prisma";
import { projects } from "../../src/types/prisma";

const prismaMock = jest.mocked(prisma);
jest.mock("../../src/services/insights/utils/getGeneralInfo");
jest.mock("../../src/services/insights/utils/countModelFields");
jest.mock("../../src/services/insights/utils/getProjectsProgress");

afterEach(() => jest.clearAllMocks());

describe("insight service suite", () => {
  const idMock = faker.database.mongodbObjectId();
  const statusMock = {
    "0": { _count: 10, status: "completed" },
    "1": { _count: 10, status: "active" },
  };
  const priorityMock = {
    "0": { _count: 10, priority: "modetate" },
    "1": { _count: 10, priority: "high" },
  };
  const generalInfoMock: genInfo.GeneralInfo = {
    total: 20,
    status: statusMock,
    priority: priorityMock,
  };
  const project = {
    id: faker.database.mongodbObjectId(),
    name: faker.commerce.productName(),
    priority: faker.helpers.arrayElement(["low, moderate, high"]),
    status: faker.helpers.arrayElement(["active", "completed"]),
    tasks: [1, 2, 3, 4, 5], //simulating completed tasks
    _count: { tasks: 10 },
  } as unknown as projects;
  const progressInsightsMock: progress.ProgjectProgressModel[] = [
    {
      id: project.id,
      name: project.name,
      priority: project.priority,
      status: project.status,
      progress: 50,
    },
    {
      id: project.id,
      name: project.name,
      priority: project.priority,
      status: project.status,
      progress: 50,
    },
  ];

  test("general info internal service util", async () => {
    jest
      .spyOn(countModels, "countModelFields")
      .mockResolvedValueOnce(statusMock)
      .mockResolvedValueOnce(priorityMock);

    const insights = await genInfo.getGeneralInfo(idMock, "projects");

    expect(countModels.countModelFields).toHaveBeenCalledTimes(2);
    expect(countModels.countModelFields).toHaveBeenCalledWith(
      idMock,
      "projects",
      ["status"]
    );
    expect(countModels.countModelFields).toHaveBeenLastCalledWith(
      idMock,
      "projects",
      ["priority"]
    );
    expect(insights).toMatchObject<genInfo.GeneralInfo>({
      total: 20,
      status: statusMock,
      priority: priorityMock,
    });
  });

  test("projects progress intenral service util", async () => {
    prismaMock.projects.findMany.mockResolvedValue([project, project]);

    const insights = await progress.getProjectsProgress(idMock);

    expect(prismaMock.projects.findMany).toHaveBeenCalled();
    expect(insights).toMatchObject<progress.ProgjectProgressModel[]>(
      progressInsightsMock
    );
  });

  test("projects insight service", async () => {
    jest.spyOn(genInfo, "getGeneralInfo").mockResolvedValue(generalInfoMock);
    jest
      .spyOn(progress, "getProjectsProgress")
      .mockResolvedValue(progressInsightsMock);

    const insights = await service.projectsInsight(idMock);

    expect(genInfo.getGeneralInfo).toHaveBeenCalledWith(idMock, "projects");
    expect(progress.getProjectsProgress).toHaveBeenCalledWith(idMock);
    expect(insights).toMatchObject<service.ProjectsInsightModel>({
      general: generalInfoMock,
      progresses: progressInsightsMock,
    });
  });

  test("tasks insight service", async () => {
    jest.spyOn(genInfo, "getGeneralInfo").mockResolvedValue(generalInfoMock);

    const insights = await service.tasksInsights(idMock);

    expect(genInfo.getGeneralInfo).toHaveBeenCalledWith(idMock, "tasks");
    expect(insights).toMatchObject<service.TasksInsightModel>({
      general: generalInfoMock,
    });
  });
});
