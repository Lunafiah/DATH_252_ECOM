const request = require('supertest');
const express = require('express');
const apiRoutes = require('../../src/routes/index');
const { createTestAdmin, generateTestToken } = require('../helpers/testUtils');

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('Coupon Routes Integration Tests', () => {
  let adminToken;

  beforeEach(async () => {
    const admin = await createTestAdmin();
    adminToken = generateTestToken(admin._id);
  });

  describe('POST /api/coupons (Admin only)', () => {
    it('should allow admin to create coupon', async () => {
      const response = await request(app)
        .post('/api/coupons')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'SUMMER2024',
          expiry: new Date('2099-12-31'),
          discount: 20,
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('SUMMER2024');
      expect(response.body.discount).toBe(20);
    });

    it('should return 400 for duplicate coupon', async () => {
      const couponData = {
        name: 'DUPLICATE',
        expiry: new Date('2099-12-31'),
        discount: 15,
      };

      await request(app)
        .post('/api/coupons')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(couponData);

      const response = await request(app)
        .post('/api/coupons')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(couponData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('đã tồn tại');
    });
  });

  describe('GET /api/coupons (Admin only)', () => {
    it('should allow admin to list coupons', async () => {
      await request(app)
        .post('/api/coupons')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'COUPON1',
          expiry: new Date('2099-12-31'),
          discount: 10,
        });

      const response = await request(app)
        .get('/api/coupons')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/coupons/apply', () => {
    beforeEach(async () => {
      // Create valid coupon
      await request(app)
        .post('/api/coupons')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'VALID20',
          expiry: new Date('2099-12-31'),
          discount: 20,
        });

      // Create expired coupon
      await request(app)
        .post('/api/coupons')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'EXPIRED10',
          expiry: new Date('2020-01-01'),
          discount: 10,
        });
    });

    it('should apply valid coupon', async () => {
      const response = await request(app)
        .post('/api/coupons/apply')
        .send({ name: 'VALID20' });

      expect(response.status).toBe(200);
      expect(response.body.discount).toBe(20);
      expect(response.body.code).toBe('VALID20');
      expect(response.body.message).toContain('20%');
    });

    it('should be case-insensitive', async () => {
      const response = await request(app)
        .post('/api/coupons/apply')
        .send({ name: 'valid20' });

      expect(response.status).toBe(200);
      expect(response.body.discount).toBe(20);
    });

    it('should reject invalid coupon code', async () => {
      const response = await request(app)
        .post('/api/coupons/apply')
        .send({ name: 'INVALID' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('không hợp lệ');
    });

    it('should reject expired coupon', async () => {
      const response = await request(app)
        .post('/api/coupons/apply')
        .send({ name: 'EXPIRED10' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('hết hạn');
    });
  });

  describe('DELETE /api/coupons/:id (Admin only)', () => {
    it('should allow admin to delete coupon', async () => {
      const createResponse = await request(app)
        .post('/api/coupons')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'DELETEME',
          expiry: new Date('2099-12-31'),
          discount: 5,
        });

      const couponId = createResponse.body._id;

      const response = await request(app)
        .delete(`/api/coupons/${couponId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Đã xóa');
    });
  });
});
