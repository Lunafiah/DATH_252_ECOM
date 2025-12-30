const container = require('../../../src/config/container');
const User = require('../../../src/models/user.model');
const { createTestUser } = require('../../helpers/testUtils');

// Get service from container
const authService = container.getService('auth');

describe('AuthService', () => {
  describe('register', () => {
    it('should successfully register a new user', async () => {
      const result = await authService.register(
        'John Doe',
        'john@example.com',
        'password123'
      );

      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('name', 'John Doe');
      expect(result).toHaveProperty('email', 'john@example.com');
      expect(result).toHaveProperty('role', 'customer');
      expect(result).toHaveProperty('token');
      expect(typeof result.token).toBe('string');
    });

    it('should throw error when email already exists', async () => {
      // Create a user first
      await createTestUser({ email: 'existing@example.com' });

      // Try to register with same email
      await expect(
        authService.register('Another User', 'existing@example.com', 'password123')
      ).rejects.toThrow('Email này đã được sử dụng');
    });

    it('should hash the password before saving', async () => {
      const result = await authService.register(
        'Jane Doe',
        'jane@example.com',
        'password123'
      );

      const user = await User.findById(result._id);
      expect(user.password).not.toBe('password123');
      expect(user.password.length).toBeGreaterThan(20); // Bcrypt hash is longer
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      await createTestUser({
        email: 'login@example.com',
        password: 'password123',
      });
    });

    it('should successfully login with valid credentials', async () => {
      const result = await authService.login('login@example.com', 'password123');

      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('email', 'login@example.com');
      expect(result).toHaveProperty('token');
      expect(typeof result.token).toBe('string');
    });

    it('should throw error with wrong password', async () => {
      await expect(
        authService.login('login@example.com', 'wrongpassword')
      ).rejects.toThrow('Sai email hoặc mật khẩu');
    });

    it('should throw error with non-existent email', async () => {
      await expect(
        authService.login('nonexistent@example.com', 'password123')
      ).rejects.toThrow('Sai email hoặc mật khẩu');
    });

    it('should return user role in login response', async () => {
      const result = await authService.login('login@example.com', 'password123');
      expect(result).toHaveProperty('role');
      expect(['customer', 'admin']).toContain(result.role);
    });
  });

  describe('tokenService', () => {
    it('should generate a valid JWT token', () => {
      const tokenService = container.getService('auth').tokenService;
      const userId = '507f1f77bcf86cd799439011';
      const token = tokenService.generate(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });
});
