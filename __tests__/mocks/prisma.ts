import { PrismaClient } from "../../src/types/prisma";
import { mockDeep, mockReset } from "jest-mock-extended";

const prismaMock = mockDeep<PrismaClient>();

jest.mock("../../src/configs/prisma", () => ({
  prisma: prismaMock,
}));

beforeEach(() => mockReset(prismaMock));

export { prismaMock };
