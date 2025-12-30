const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  // Create in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(mongoUri);
}, 60000); // Increase timeout to 60 seconds

// Cleanup after each test
afterEach(async () => {
  // Clear all collections after each test to ensure isolation
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}, 30000); // Increase timeout to 30 seconds

// Cleanup after all tests
afterAll(async () => {
  // Disconnect and stop the in-memory database
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 60000); // Increase timeout to 60 seconds

// Suppress console logs during tests (optional)
global.console = {
  ...console,
  log: jest.fn(), // Suppress console.log
  debug: jest.fn(), // Suppress console.debug
  info: jest.fn(), // Suppress console.info
  warn: console.warn, // Keep warnings
  error: console.error, // Keep errors
};

