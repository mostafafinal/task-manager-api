import * as genInfo from "../../../src/services/insights/utils/getGeneralInfo";
import * as progress from "../../../src/services/insights/utils/getProjectsProgress";
import * as prodactivity from "../../../src/services/insights/utils/getProductivity";
import * as service from "../../../src/services/insights/insightsService";
import { faker } from "@faker-js/faker";

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

  test("projects insight service", async () => {
    const projectProggressMock: progress.ProgjectProgressModel = {
      id: faker.database.mongodbObjectId(),
      name: faker.commerce.productName(),
      priority: faker.helpers.arrayElement(["low", "moderate", "high"]),
      status: faker.helpers.arrayElement(["active", "completed"]),
      progress: 50,
    };
    const progressInsightsMock: progress.ProgjectProgressModel[] = [
      projectProggressMock,
    ];

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
    const productiveModelMock: prodactivity.ProductiveModel = {
      id: faker.database.mongodbObjectId(),
      name: faker.commerce.productName(),
      priority: faker.helpers.arrayElement(["low", "moderate", "high"]),
      status: "completed",
    };
    const prodactivityInsightMock: prodactivity.ProductivityInsight = {
      lastSeven: [productiveModelMock],
      lastThirty: [productiveModelMock],
      lastSixtyFive: [productiveModelMock],
    };

    jest.spyOn(genInfo, "getGeneralInfo").mockResolvedValue(generalInfoMock);
    jest
      .spyOn(prodactivity, "getProductivity")
      .mockResolvedValue(prodactivityInsightMock);

    const insights = await service.tasksInsights(idMock);

    expect(genInfo.getGeneralInfo).toHaveBeenCalledWith(idMock, "tasks");
    expect(prodactivity.getProductivity).toHaveBeenCalledWith(idMock, "tasks");
    expect(insights).toMatchObject<service.TasksInsightModel>({
      general: generalInfoMock,
      productivity: prodactivityInsightMock,
    });
  });
});
