import * as service from "../../../src/services/projectService/projectService";
import {
  Query,
  queryHandler,
} from "../../../src/services/projectService/queryHandler";

jest.mock("../../../src/services/projectService/projectService");

describe("Projects query handler suite", () => {
  test("find projects", async () => {
    const queryWithSearchMock = { userId: "id-mock", search: "searching" };

    await queryHandler(queryWithSearchMock as Query);

    expect(service.findProjects).toHaveBeenCalled();
  });

  test("get paginated projects", async () => {
    const queryWithoutSearchMock = { userId: "id-mock", page: 1, limit: 10 };

    await queryHandler(queryWithoutSearchMock as Query);

    expect(service.getProjects).toHaveBeenCalled();
  });
});
