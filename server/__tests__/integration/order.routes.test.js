const request = require('supertest');
const express = require('express');
const apiRoutes = require('../../src/routes/index');
const Product = require('../../src/models/product.model');
const { createTestProduct, createTestUser, createTestAdmin, generateTestToken } = require('../helpers/testUtils');

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('Order Routes Integration Tests', () => {
  describe('POST /api/orders', () => {
    it('should create order and reduce inventory', async () => {
      await createTestProduct({ 
        title: 'Test Sofa',
        countInStock: 10,
        price: 500
      });

      const orderData = {
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          address: '123 Main St',
          city: 'New York',
        },
        items: [
          {
            title: 'Test Sofa',
            qty: 3,
            price: 500,
          },
        ],
        totalAmount: 1500,
        paymentMethod: 'COD',
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.totalAmount).toBe(1500);

      // Verify inventory was reduced
      const updatedProduct = await Product.findOne({ title: 'Test Sofa' });
      expect(updatedProduct.countInStock).toBe(7); // 10 - 3
    });

    it('should return 400 when insufficient stock', async () => {
      await createTestProduct({ 
        title: 'Limited Sofa',
        countInStock: 2,
        price: 500
      });

      const orderData = {
        customer: { name: 'John', email: 'john@example.com', phone: '123', address: '123 St', city: 'NYC' },
        items: [{ title: 'Limited Sofa', qty: 5, price: 500 }],
        totalAmount: 2500,
        paymentMethod: 'COD',
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('insufficient stock');
    });

    it('should return 400 for empty cart', async () => {
      const orderData = {
        customer: { name: 'John', email: 'john@example.com', phone: '123', address: '123 St', city: 'NYC' },
        items: [],
        totalAmount: 0,
        paymentMethod: 'COD',
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('trống');
    });
  });

  describe('GET /api/orders/mine', () => {
    it('should get user orders', async () => {
      const user = await createTestUser({ email: 'customer@example.com' });
      const token = generateTestToken(user._id);
      await createTestProduct({ title: 'Order Product', countInStock: 100 });

      // Create an order
      await request(app)
        .post('/api/orders')
        .send({
          customer: { name: 'Customer', email: 'customer@example.com', phone: '123', address: '123 St', city: 'NYC' },
          items: [{ title: 'Order Product', qty: 1, price: 100 }],
          totalAmount: 100,
          paymentMethod: 'COD',
        });

      const response = await request(app)
        .get('/api/orders/mine')
        .set('Authorization', `Bearer ${token}`)
        .query({ email: 'customer@example.com' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/orders (Admin only)', () => {
    it('should allow admin to get all orders', async () => {
      const admin = await createTestAdmin();
      const token = generateTestToken(admin._id);

      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should deny regular user from getting all orders', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id);

      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/orders/:id/status (Admin only)', () => {
    it('should allow admin to update order status', async () => {
      const admin = await createTestAdmin();
      const token = generateTestToken(admin._id);
      await createTestProduct({ title: 'Status Product', countInStock: 100 });

      // Create order
      const orderResponse = await request(app)
        .post('/api/orders')
        .send({
          customer: { name: 'Customer', email: 'customer@example.com', phone: '123', address: '123 St', city: 'NYC' },
          items: [{ title: 'Status Product', qty: 1, price: 100 }],
          totalAmount: 100,
          paymentMethod: 'COD',
        });

      const orderId = orderResponse.body._id;

      // Update status
      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'shipping' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('shipping');
    });
  });
});
