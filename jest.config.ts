import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  testPathIgnorePatterns: ["./node_modules"],
  roots: ["<rootDir>/__tests__/"],
};

export default config;
