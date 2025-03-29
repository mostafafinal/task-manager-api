import { deleteUserTasks } from "../../src/jobs/deleteUserTasks";
import { Agenda, Job } from "@hokify/agenda";
import { Task } from "../../src/models/Task";

jest.mock("../../src/models/Task");

afterAll(() => jest.clearAllMocks());

const agendaMock = {
  define: jest.fn(),
} as unknown as jest.Mocked<Agenda>;
const jobDataMock = {
  attrs: {
    data: "id-mock",
  },
} as Job;

test("delete user tasks job", async () => {
  deleteUserTasks(agendaMock);

  const jobCallbackMock = agendaMock.define.mock.calls[0][1];

  Task.deleteMany = jest.fn();

  await jobCallbackMock(jobDataMock);

  expect(agendaMock.define).toHaveBeenCalledWith(
    "delete user tasks",
    expect.any(Function)
  );
  expect(Task.deleteMany).toHaveBeenCalledWith({ userId: "id-mock" });
});
