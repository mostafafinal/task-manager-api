import * as util from "../../src/utils/countModelFields";
import * as service from "../../src/services/insightsService";
import { faker } from "@faker-js/faker";

jest.mock("../../src/utils/countModelFields");

afterEach(() => jest.clearAllMocks());

describe("insight service suite", () => {
  const statusMock = {
    "0": { _count: 10, status: "completed" },
    "1": { _count: 10, status: "active" },
  };
  const priorityMock = {
    "0": { _count: 10, priority: "modetate" },
    "1": { _count: 10, priority: "high" },
  };
  const idMock = faker.database.mongodbObjectId();

  jest
    .spyOn(util, "countModelFields")
    .mockResolvedValueOnce(statusMock)
    .mockResolvedValueOnce(priorityMock);

  test.skip("project insights service", async () => {
    const insights = await service.projectsInsights(idMock);

    expect(util.countModelFields).toHaveBeenCalledTimes(2);
    expect(util.countModelFields).toHaveBeenCalledWith(idMock, "projects", [
      "status",
    ]);
    expect(util.countModelFields).toHaveBeenLastCalledWith(idMock, "projects", [
      "priority",
    ]);
    expect(insights).toMatchObject({
      total: 20,
      status: statusMock,
      priority: priorityMock,
    });
  });

  test("task insights service", async () => {
    const insights = await service.tasksInsights(idMock);

    expect(util.countModelFields).toHaveBeenCalledTimes(2);
    expect(util.countModelFields).toHaveBeenCalledWith(idMock, "tasks", [
      "status",
    ]);
    expect(util.countModelFields).toHaveBeenLastCalledWith(idMock, "tasks", [
      "priority",
    ]);
    expect(insights).toMatchObject({
      total: 20,
      status: statusMock,
      priority: priorityMock,
    });
  });
});
