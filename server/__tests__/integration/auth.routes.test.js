const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('../../src/routes/index');
const { createTestUser, createTestAdmin, generateTestToken } = require('../helpers/testUtils');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('Authentication Routes Integration Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('email', 'newuser@example.com');
      expect(response.body).toHaveProperty('name', 'New User');
    });

    it('should return 400 for duplicate email', async () => {
      await createTestUser({ email: 'duplicate@example.com' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another User',
          email: 'duplicate@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('đã được sử dụng');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await createTestUser({
        email: 'login@example.com',
        password: 'password123',
      });
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('email', 'login@example.com');
    });

    it('should return 401 for wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Sai email hoặc mật khẩu');
    });

    it('should return 401 for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('Protected Routes', () => {
    it('should allow access to protected route with valid token', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id);

      const response = await request(app)
        .get('/api/orders/mine')
        .set('Authorization', `Bearer ${token}`)
        .query({ email: user.email });

      expect(response.status).not.toBe(401);
    });

    it('should deny access to protected route without token', async () => {
      const response = await request(app)
        .get('/api/orders/mine')
        .query({ email: 'test@example.com' });

      expect(response.status).toBe(401);
    });
  });

  describe('Admin Routes', () => {
    it('should allow admin to access admin-only routes', async () => {
      const admin = await createTestAdmin();
      const token = generateTestToken(admin._id);

      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).not.toBe(403);
    });

    it('should deny regular user access to admin routes', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id);

      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });
});
