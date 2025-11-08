const nextJest = require("next/jest.js");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./"
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.tsx"],
  collectCoverage: false,
  verbose: true,
  moduleDirectories: ["node_modules", "<rootDir>/"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    "!src/**/page.tsx",
    "!src/**/layout.tsx",
    "!src/**/loading.tsx",
    "!src/**/error.tsx",
    "!src/**/not-found.tsx",
    "!src/**/globals.css",
    "!src/generated/**",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**"
  ],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{ts,tsx}"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  watchPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/coverage/",
    "<rootDir>/playwright-report/",
    "<rootDir>/test-results/"
  ],
  coverageReporters: ["json", "text", "lcov", "clover"]
};

module.exports = async () => {
  // Create Next.js jest configuration
  const nextJestConfig = await createJestConfig(customJestConfig)();

  // Add the transformIgnorePatterns setting
  nextJestConfig.transformIgnorePatterns = [
    "/node_modules/(?!next-auth|@auth/core|jose)/",
    "^.+\.module\.(css|sass|scss)$"
  ];

  return nextJestConfig;
};
