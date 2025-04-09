import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  testPathIgnorePatterns: ["./node_modules", "./__tests__/mocks"],
  setupFilesAfterEnv: ["./__tests__/mocks/prisma.ts"],
};

export default config;
