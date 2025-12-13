module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/app"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testMatch: ["**/?(*.)+(spec|test).[tj]s"],
  moduleNameMapper: {
    "^@app/(.*)$": "<rootDir>/app/$1",
    "^@MyFW/(.*)$": "<rootDir>/app/Infrastructure/FW/MyFW/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/app/__tests__/setupTests.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json",
    },
  },
  collectCoverageFrom: [
    "app/**/*.ts",
    "!app/**/*.d.ts",
    "!app/**/*.test.ts",
    "!app/**/*.spec.ts",
    "!app/__tests__/**",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.jest/",
  ],
  coverageReporters: ["text", "lcov", "html"],
  coverageDirectory: "<rootDir>/coverage",
}
