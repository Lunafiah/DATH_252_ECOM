const { protect, admin } = require('../../../src/middlewares/authMiddleware');
const User = require('../../../src/models/user.model');
const { 
  createTestUser, 
  createTestAdmin, 
  generateTestToken,
  mockRequest,
  mockResponse,
  mockNext 
} = require('../../helpers/testUtils');

describe('Auth Middleware', () => {
  describe('protect middleware', () => {
    it('should allow access with valid token', async () => {
      const testUser = await createTestUser();
      const token = generateTestToken(testUser._id);

      const req = mockRequest({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const res = mockResponse();
      const next = mockNext();

      await protect(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.email).toBe(testUser.email);
    });

    it('should deny access without token', async () => {
      const req = mockRequest({
        headers: {},
      });
      const res = mockResponse();
      const next = mockNext();

      await protect(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.stringContaining('chưa đăng nhập'),
      });
    });

    it('should deny access with invalid token', async () => {
      const req = mockRequest({
        headers: {
          authorization: 'Bearer invalid_token_here',
        },
      });
      const res = mockResponse();
      const next = mockNext();

      await protect(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.stringContaining('không hợp lệ'),
      });
    });

    it('should deny access with malformed authorization header', async () => {
      const req = mockRequest({
        headers: {
          authorization: 'InvalidFormat',
        },
      });
      const res = mockResponse();
      const next = mockNext();

      await protect(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should attach user object to request', async () => {
      const testUser = await createTestUser({ name: 'John Doe' });
      const token = generateTestToken(testUser._id);

      const req = mockRequest({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const res = mockResponse();
      const next = mockNext();

      await protect(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.name).toBe('John Doe');
      expect(req.user.password).toBeUndefined(); // Password should be excluded
    });
  });

  describe('admin middleware', () => {
    it('should allow access for admin user', () => {
      const req = mockRequest({
        user: { role: 'admin', email: 'admin@example.com' },
      });
      const res = mockResponse();
      const next = mockNext();

      admin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access for regular user', () => {
      const req = mockRequest({
        user: { role: 'customer', email: 'user@example.com' },
      });
      const res = mockResponse();
      const next = mockNext();

      admin(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.stringContaining('Admin'),
      });
    });

    it('should deny access when user is not authenticated', () => {
      const req = mockRequest({
        user: null,
      });
      const res = mockResponse();
      const next = mockNext();

      admin(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
