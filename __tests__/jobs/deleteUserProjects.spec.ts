import { deleteUserProjects } from "../../src/jobs/deleteUserProjects";
import { Agenda, Job } from "@hokify/agenda";
import { Project } from "../../src/models/Project";

jest.mock("../../src/models/Project");

afterAll(() => jest.clearAllMocks());

const agendaMock = {
  define: jest.fn(),
} as unknown as jest.Mocked<Agenda>;
const jobDataMock = {
  attrs: {
    data: "id-mock",
  },
} as Job;

test("delete user projects job test", async () => {
  deleteUserProjects(agendaMock);

  const jobCallbackMock = agendaMock.define.mock.calls[0][1];

  Project.deleteMany = jest.fn();

  await jobCallbackMock(jobDataMock);

  expect(agendaMock.define).toHaveBeenCalledWith(
    "delete user projects",
    expect.any(Function)
  );
  expect(Project.deleteMany).toHaveBeenCalledWith({ userId: "id-mock" });
});
