process.env.JWT_SECRET = "testsecret";

// clean mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});