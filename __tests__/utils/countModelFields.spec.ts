import { prisma } from "../../src/configs/prisma";
import { faker } from "@faker-js/faker";
import * as util from "../../src/utils/countModelFields";
import { Prisma } from "../../src/types/prisma";

const prismaMock = jest.mocked(prisma);
jest.spyOn(util, "validateModel").mockReturnValue(true);

test("count model properties util", async () => {
  const userId = faker.database.mongodbObjectId();
  const modelName: Prisma.ModelName = "projects";
  const propName = "status";

  // @ts-expect-error models are dynamic
  prismaMock[modelName].groupBy.mockResolvedValue({ mock: "data-mock" });

  const data = await util.countModelFields(userId, modelName, [propName]);

  expect(util.validateModel).toHaveBeenCalledWith(modelName, propName);
  expect(prismaMock[modelName].groupBy).toHaveBeenCalled();
  expect(data).toMatchObject({ mock: "data-mock" });
});
