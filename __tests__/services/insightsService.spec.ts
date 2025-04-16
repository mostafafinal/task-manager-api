import * as util from "../../src/utils/countModelFields";
import * as service from "../../src/services/insightsService";
import { faker } from "@faker-js/faker";

jest.mock("../../src/utils/countModelFields");

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
  const generalInfoMock: service.GeneralInfo = {
    total: 20,
    status: statusMock,
    priority: priorityMock,
  };

  test("general info internal service util", async () => {
    jest
      .spyOn(util, "countModelFields")
      .mockResolvedValueOnce(statusMock)
      .mockResolvedValueOnce(priorityMock);

    const insights = await service.getGeneralInfo(idMock, "projects");

    expect(util.countModelFields).toHaveBeenCalledTimes(2);
    expect(util.countModelFields).toHaveBeenCalledWith(idMock, "projects", [
      "status",
    ]);
    expect(util.countModelFields).toHaveBeenLastCalledWith(idMock, "projects", [
      "priority",
    ]);
    expect(insights).toMatchObject<service.GeneralInfo>({
      total: 20,
      status: statusMock,
      priority: priorityMock,
    });
  });

  test("projects insight service", async () => {
    jest.spyOn(service, "getGeneralInfo").mockResolvedValue(generalInfoMock);

    const insights = await service.projectsInsight(idMock);

    expect(service.getGeneralInfo).toHaveBeenCalledWith(idMock, "projects");
    expect(insights).toMatchObject<service.TasksInsightModel>({
      general: generalInfoMock,
    });
  });

  test("tasks insight service", async () => {
    jest.spyOn(service, "getGeneralInfo").mockResolvedValue(generalInfoMock);

    const insights = await service.tasksInsights(idMock);

    expect(service.getGeneralInfo).toHaveBeenCalledWith(idMock, "tasks");
    expect(insights).toMatchObject<service.TasksInsightModel>({
      general: generalInfoMock,
    });
  });
});
