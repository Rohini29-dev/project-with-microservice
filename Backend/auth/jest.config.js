module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],
  testPathIgnorePatterns: ["<rootDir>/__tests__/setup.js"], // ✅ ADD THIS
};