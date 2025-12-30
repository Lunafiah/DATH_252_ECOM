const jwt = require('jsonwebtoken');
const User = require('../../src/models/user.model');
const Product = require('../../src/models/product.model');

/**
 * Generate a valid JWT token for testing
 */
const generateTestToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

/**
 * Create a test user in the database
 */
const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'customer',
  };

  const user = await User.create({ ...defaultUser, ...overrides });
  return user;
};

/**
 * Create a test admin user
 */
const createTestAdmin = async (overrides = {}) => {
  return createTestUser({
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    ...overrides,
  });
};

/**
 * Create a test product in the database
 */
const createTestProduct = async (overrides = {}) => {
  const defaultProduct = {
    id: Math.floor(Math.random() * 10000),
    title: 'Test Sofa',
    price: 500,
    description: 'A comfortable test sofa',
    category: 'sofa',
    image: 'https://example.com/test-sofa.jpg',
    rating: { rate: 4.5, count: 10 },
    countInStock: 20,
    isBestSeller: false,
  };

  const product = await Product.create({ ...defaultProduct, ...overrides });
  return product;
};

/**
 * Create multiple test products
 */
const createTestProducts = async (count = 5) => {
  const products = [];
  for (let i = 0; i < count; i++) {
    const product = await createTestProduct({
      id: i + 1,
      title: `Test Product ${i + 1}`,
      price: 100 + i * 50,
    });
    products.push(product);
  }
  return products;
};

/**
 * Mock Express request object
 */
const mockRequest = (overrides = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    ...overrides,
  };
};

/**
 * Mock Express response object
 */
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Mock Express next function
 */
const mockNext = () => jest.fn();

module.exports = {
  generateTestToken,
  createTestUser,
  createTestAdmin,
  createTestProduct,
  createTestProducts,
  mockRequest,
  mockResponse,
  mockNext,
};
