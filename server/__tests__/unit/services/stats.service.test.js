const container = require('../../../src/config/container');
const { createTestProduct, createTestUser } = require('../../helpers/testUtils');

// Get services from container
const statsService = container.getService('stats');
const orderService = container.getService('order');

describe('StatsService', () => {
  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      // Create some test data
      await createTestProduct({ title: 'Product 1', countInStock: 10 });
      await createTestProduct({ title: 'Product 2', countInStock: 20 });
      await createTestUser({ email: 'customer1@example.com' });
      await createTestUser({ email: 'customer2@example.com' });

      // Create some orders
      await createTestProduct({ title: 'Order Product', countInStock: 100 });
      await orderService.createOrder({
        customer: { name: 'User1', email: 'user1@example.com', phone: '123', address: '123 St', city: 'NYC' },
        items: [{ title: 'Order Product', qty: 1, price: 100 }],
        totalAmount: 100,
        paymentMethod: 'COD',
      });

      await orderService.createOrder({
        customer: { name: 'User2', email: 'user2@example.com', phone: '456', address: '456 St', city: 'NYC' },
        items: [{ title: 'Order Product', qty: 2, price: 100 }],
        totalAmount: 200,
        paymentMethod: 'COD',
      });

      const stats = await statsService.getDashboardStats();

      expect(stats).toHaveProperty('totalOrders');
      expect(stats).toHaveProperty('totalProducts');
      expect(stats).toHaveProperty('totalUsers');
      expect(stats).toHaveProperty('totalRevenue');

      expect(stats.totalOrders).toBeGreaterThanOrEqual(2);
      expect(stats.totalProducts).toBeGreaterThanOrEqual(3);
      expect(stats.totalUsers).toBeGreaterThanOrEqual(2);
      expect(stats.totalRevenue).toBeGreaterThanOrEqual(300);
    });

    it('should return zero revenue when no orders exist', async () => {
      const stats = await statsService.getDashboardStats();

      expect(stats.totalRevenue).toBe(0);
    });

    it('should count only customer users', async () => {
      await createTestUser({ email: 'customer@example.com', role: 'customer' });

      const stats = await statsService.getDashboardStats();

      expect(stats.totalUsers).toBeGreaterThanOrEqual(1);
    });
  });
});
