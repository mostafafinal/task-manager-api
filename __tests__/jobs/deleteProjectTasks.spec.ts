import { Agenda, Job } from "@hokify/agenda";
import { deleteProjectTasks } from "../../src/jobs/deleteProjectTasks";
import { Task } from "../../src/models/Task";

jest.mock("../../src/models/Task");

const agendaMock = {
  define: jest.fn(),
} as unknown as jest.Mocked<Agenda>;

const jobDataMock = {
  attrs: {
    data: {
      projectId: "id-mock",
    },
  },
} as unknown as Job;

test("delete project tasks job test", async () => {
  deleteProjectTasks(agendaMock);

  const jobCallbackMock = agendaMock.define.mock.calls[0][1];

  Task.deleteMany = jest.fn();

  await jobCallbackMock(jobDataMock);

  expect(agendaMock.define).toHaveBeenCalledWith(
    "delete project tasks",
    expect.any(Function)
  );
  expect(Task.deleteMany).toHaveBeenCalledWith({ projectId: "id-mock" });
});
