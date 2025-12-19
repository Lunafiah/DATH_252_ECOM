const request = require('supertest');
const express = require('express');
const apiRoutes = require('../../src/routes/index');
const { createTestProduct, createTestAdmin, generateTestToken, createTestUser } = require('../helpers/testUtils');

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('Product Routes Integration Tests', () => {
  describe('GET /api/products', () => {
    beforeEach(async () => {
      await createTestProduct({ title: 'Sofa A', category: 'sofa', price: 300 });
      await createTestProduct({ title: 'Sofa B', category: 'sofa', price: 500 });
      await createTestProduct({ title: 'Chair A', category: 'chair', price: 150 });
    });

    it('should get all products', async () => {
      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ category: 'sofa' });

      expect(response.status).toBe(200);
      expect(response.body.every(p => p.category === 'sofa')).toBe(true);
    });

    it('should filter products by price range', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ minPrice: 200, maxPrice: 400 });

      expect(response.status).toBe(200);
      expect(response.body.every(p => p.price >= 200 && p.price <= 400)).toBe(true);
    });

    it('should search products by keyword', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ keyword: 'Sofa' });

      expect(response.status).toBe(200);
      expect(response.body.every(p => p.title.includes('Sofa'))).toBe(true);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should get product by ID', async () => {
      const product = await createTestProduct({ title: 'Test Product' });

      const response = await request(app).get(`/api/products/${product._id}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Test Product');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app).get('/api/products/507f1f77bcf86cd799439011');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/products (Admin only)', () => {
    it('should allow admin to create product', async () => {
      const admin = await createTestAdmin();
      const token = generateTestToken(admin._id);

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'New Sofa',
          price: 600,
          description: 'A new sofa',
          category: 'sofa',
          image: 'https://example.com/sofa.jpg',
          countInStock: 10,
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('New Sofa');
    });

    it('should deny regular user from creating product', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id);

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Unauthorized Product',
          price: 100,
          category: 'sofa',
        });

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/products/:id/reviews', () => {
    it('should allow authenticated user to add review', async () => {
      const product = await createTestProduct();
      const user = await createTestUser();
      const token = generateTestToken(user._id);

      const response = await request(app)
        .post(`/api/products/${product._id}/reviews`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          rating: 5,
          comment: 'Excellent product!',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('Review added');
    });

    it('should prevent duplicate reviews', async () => {
      const product = await createTestProduct();
      const user = await createTestUser();
      const token = generateTestToken(user._id);

      // First review
      await request(app)
        .post(`/api/products/${product._id}/reviews`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 5, comment: 'Great!' });

      // Second review (should fail)
      const response = await request(app)
        .post(`/api/products/${product._id}/reviews`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 4, comment: 'Still good' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already reviewed');
    });
  });

  describe('GET /api/products/:id/reviews', () => {
    it('should get all reviews for a product', async () => {
      const product = await createTestProduct();
      const user1 = await createTestUser({ email: 'user1@example.com' });
      const user2 = await createTestUser({ email: 'user2@example.com' });

      const token1 = generateTestToken(user1._id);
      const token2 = generateTestToken(user2._id);

      await request(app)
        .post(`/api/products/${product._id}/reviews`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ rating: 5, comment: 'Great!' });

      await request(app)
        .post(`/api/products/${product._id}/reviews`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ rating: 4, comment: 'Good!' });

      const response = await request(app).get(`/api/products/${product._id}/reviews`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });
  });
});
