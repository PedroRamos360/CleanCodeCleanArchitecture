/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["./jest.setup.ts"],
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        isolatedModules: true,
      },
    ],
  },
};
