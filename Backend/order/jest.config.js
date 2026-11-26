module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],
  testPathIgnorePatterns: ["/node_modules/", "__tests__/setup.js"] // 👈 add this
}