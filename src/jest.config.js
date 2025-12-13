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
}
