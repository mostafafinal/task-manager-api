import app from "../../src/index";
import request, { Response } from "supertest";
import * as insights from "../../src/services/insights/insightsService";
import { GeneralInfo } from "../../src/services/insights/utils/getGeneralInfo";
import { ProductivityInsight } from "../../src/services/insights/utils/getProductivity";
import { ENV_VARS } from "../../src/configs/envs";

jest.mock("../../src/services/insights/insightsService");

describe("insights controller suite", () => {
  afterEach(() => jest.clearAllMocks());

  test("get insights requrest", async () => {
    const projectsInsightMock = { general: {} as GeneralInfo, progresses: [] };
    const tasksInsightMock = {
      general: {} as GeneralInfo,
      productivity: {} as ProductivityInsight,
    };

    jest
      .spyOn(insights, "projectsInsight")
      .mockResolvedValue(projectsInsightMock);
    jest.spyOn(insights, "tasksInsights").mockResolvedValue(tasksInsightMock);

    const res: Response = await request(app)
      .get("/insights/dashboard")
      .set("Cookie", `x-auth-token=${ENV_VARS.JWT_SIGNED_TOKEN}`);

    expect(insights.projectsInsight).toHaveBeenCalled();
    expect(insights.tasksInsights).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toMatchObject({
      projects: projectsInsightMock,
      tasks: tasksInsightMock,
    });
  });
});
