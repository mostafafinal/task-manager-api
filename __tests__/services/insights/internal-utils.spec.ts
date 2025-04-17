import { prisma } from "../../../src/configs/prisma";
import { faker } from "@faker-js/faker";
import * as count from "../../../src/services/insights/utils/countModelFields";
import * as info from "../../../src/services/insights/utils/getGeneralInfo";
import * as progress from "../../../src/services/insights/utils/getProjectsProgress";
import * as prodactivity from "../../../src/services/insights/utils/getProductivity";
import { Prisma, projects } from "../../../src/types/prisma";

const prismaMock = jest.mocked(prisma);

describe("Internal insights service util suite", () => {
  const idMock = faker.database.mongodbObjectId();
  const modelName: Prisma.ModelName = "projects";

  test("count model properties util", async () => {
    const propName = "status";
    // @ts-expect-error models are dynamic
    prismaMock[modelName].groupBy.mockResolvedValue({ mock: "data-mock" });

    jest.spyOn(count, "validateModel").mockReturnValue(true);

    const data = await count.countModelFields(idMock, modelName, [propName]);

    expect(count.validateModel).toHaveBeenCalledWith(modelName, propName);
    expect(prismaMock[modelName].groupBy).toHaveBeenCalled();
    expect(data).toMatchObject({ mock: "data-mock" });
  });

  test("general info internal service util", async () => {
    const statusMock = {
      "0": { _count: 10, status: "completed" },
      "1": { _count: 10, status: "active" },
    };
    const priorityMock = {
      "0": { _count: 10, priority: "modetate" },
      "1": { _count: 10, priority: "high" },
    };

    jest
      .spyOn(count, "countModelFields")
      .mockResolvedValueOnce(statusMock)
      .mockResolvedValueOnce(priorityMock);

    const insights = await info.getGeneralInfo(idMock, "projects");

    expect(count.countModelFields).toHaveBeenCalledTimes(2);
    expect(count.countModelFields).toHaveBeenCalledWith(idMock, "projects", [
      "status",
    ]);
    expect(count.countModelFields).toHaveBeenLastCalledWith(
      idMock,
      "projects",
      ["priority"]
    );
    expect(insights).toMatchObject<info.GeneralInfo>({
      total: 20,
      status: statusMock,
      priority: priorityMock,
    });
  });

  test("projects progress intenral service util", async () => {
    const project = {
      id: faker.database.mongodbObjectId(),
      name: faker.commerce.productName(),
      priority: faker.helpers.arrayElement(["low, moderate, high"]),
      status: faker.helpers.arrayElement(["active", "completed"]),
      tasks: [1, 2, 3, 4, 5], //simulating completed tasks
      _count: { tasks: 10 },
    } as unknown as projects;
    const projectProggressMock: progress.ProgjectProgressModel = {
      id: project.id,
      name: project.name,
      priority: project.priority,
      status: project.status,
      progress: 50,
    };
    const progressInsightsMock: progress.ProgjectProgressModel[] = [
      projectProggressMock,
    ];

    prismaMock.projects.findMany.mockResolvedValue([project]);

    const insights = await progress.getProjectsProgress(idMock);

    expect(prismaMock.projects.findMany).toHaveBeenCalled();
    expect(insights).toMatchObject<progress.ProgjectProgressModel[]>(
      progressInsightsMock
    );
  });

  test("get productivity intenral service util", async () => {
    prismaMock[modelName].findMany.mockResolvedValue([]);

    const insights = await prodactivity.getProductivity(idMock, "projects");

    expect(prismaMock.projects.findMany).toHaveBeenCalled();
    expect(insights).toMatchObject<prodactivity.ProductivityInsight>(
      expect.any(Object)
    );
  });
});
