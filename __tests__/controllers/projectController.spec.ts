import request, { Response } from "supertest";
import app from "../../src/index";
import { faker } from "@faker-js/faker";
import * as service from "../../src/services/projectService";
import { ProjectModel } from "../../src/types/schemas";
import { Types } from "mongoose";

jest.mock("../../src/services/projectService");

describe("Project controller testing", () => {
  const id: Types.ObjectId = new Types.ObjectId(
    faker.database.mongodbObjectId()
  );
  const project: Partial<ProjectModel> = {
    name: faker.commerce.productName(),
    deadline: faker.date.soon(),
    status: faker.helpers.arrayElement(["active", "completed"]),
    priority: faker.helpers.arrayElement(["low", "moderate", "high"]),
    description: faker.commerce.productDescription(),
  };

  afterAll(() => jest.clearAllMocks());

  test("create project request", async () => {
    (service.createProject as jest.Mock) = jest.fn().mockResolvedValue(project);

    const res: Response = await request(app)
      .post("/project/create")
      .set("Cookie", [`userId=${id}`])
      .send({ project: project });

    expect(service.createProject).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("project created successfully");
    expect(res.body.data).toBeDefined();
  });

  test("get projects request", async () => {
    (service.getProjects as jest.Mock) = jest
      .fn()
      .mockResolvedValue([project, project]);

    const res: Response = await request(app)
      .get("/project")
      .set("Cookie", [`userId=${id}`]);

    expect(service.getProjects).toHaveBeenCalledWith(id);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeDefined();
  });

  test("update project request", async () => {
    const newDes = faker.commerce.productDescription();
    (service.updateProject as jest.Mock) = jest
      .fn()
      .mockResolvedValue({ ...project, description: newDes });

    const res: Response = await request(app)
      .put("/project/update")
      .set("Cookie", [`projectId=${id}`])
      .send({
        projectId: id,
        newData: {
          description: newDes,
        },
      });

    expect(service.updateProject).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("project updated successfully");
  });

  test("delete project request", async () => {
    (service.deleteProject as jest.Mock) = jest.fn();

    const res: Response = await request(app)
      .delete("/project/delete")
      .set("Cookie", [`projectId=${id}`]);

    expect(service.deleteProject).toHaveBeenCalledWith(id);
    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBeDefined();
  });
});
