const container = require('../../../src/config/container');
const Order = require('../../../src/models/order.model');
const { createTestProduct } = require('../../helpers/testUtils');

// Get service from container
const orderService = container.getService('order');

describe('OrderService', () => {
  describe('createOrder', () => {
    it('should create an order with valid data', async () => {
      const testProduct = await createTestProduct({ 
        title: 'Test Sofa',
        countInStock: 10 
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
            qty: 2,
            price: 500,
          },
        ],
        totalAmount: 1000,
        paymentMethod: 'COD',
      };

      const order = await orderService.createOrder(orderData);

      expect(order).toBeDefined();
      expect(order.customer.email).toBe('john@example.com');
      expect(order.items).toHaveLength(1);
      expect(order.totalAmount).toBe(1000);
      expect(order.status).toBe('Pending');
    });

    it('should reduce stock when order is created', async () => {
      const testProduct = await createTestProduct({ 
        title: 'Stock Test Sofa',
        countInStock: 10 
      });

      const orderData = {
        customer: { name: 'Jane', email: 'jane@example.com', phone: '123', address: '123 St', city: 'NYC' },
        items: [{ title: 'Stock Test Sofa', qty: 3, price: 500 }],
        totalAmount: 1500,
        paymentMethod: 'COD',
      };

      await orderService.createOrder(orderData);

      const Product = require('../../../src/models/product.model');
      const updatedProduct = await Product.findOne({ title: 'Stock Test Sofa' });
      expect(updatedProduct.countInStock).toBe(7); // 10 - 3
    });

    it('should throw error when product does not exist', async () => {
      const orderData = {
        customer: { name: 'John', email: 'john@example.com', phone: '123', address: '123 St', city: 'NYC' },
        items: [{ title: 'Non-existent Product', qty: 1, price: 500 }],
        totalAmount: 500,
        paymentMethod: 'COD',
      };

      await expect(orderService.createOrder(orderData)).rejects.toThrow(
        'not found in system'
      );
    });

    it('should throw error when insufficient stock', async () => {
      await createTestProduct({ 
        title: 'Limited Stock Sofa',
        countInStock: 2 
      });

      const orderData = {
        customer: { name: 'John', email: 'john@example.com', phone: '123', address: '123 St', city: 'NYC' },
        items: [{ title: 'Limited Stock Sofa', qty: 5, price: 500 }],
        totalAmount: 2500,
        paymentMethod: 'COD',
      };

      await expect(orderService.createOrder(orderData)).rejects.toThrow(
        'insufficient stock'
      );
    });
  });

  describe('getOrdersByUserEmail', () => {
    beforeEach(async () => {
      await createTestProduct({ title: 'Test Product', countInStock: 100 });

      // Create orders for different users
      await orderService.createOrder({
        customer: { name: 'User1', email: 'user1@example.com', phone: '123', address: '123 St', city: 'NYC' },
        items: [{ title: 'Test Product', qty: 1, price: 100 }],
        totalAmount: 100,
        paymentMethod: 'COD',
      });

      await orderService.createOrder({
        customer: { name: 'User2', email: 'user2@example.com', phone: '456', address: '456 St', city: 'NYC' },
        items: [{ title: 'Test Product', qty: 1, price: 100 }],
        totalAmount: 100,
        paymentMethod: 'COD',
      });
    });

    it('should return orders for specific user', async () => {
      const orders = await orderService.getOrdersByUserEmail('user1@example.com');
      
      expect(orders).toHaveLength(1);
      expect(orders[0].customer.email).toBe('user1@example.com');
    });

    it('should return empty array for user with no orders', async () => {
      const orders = await orderService.getOrdersByUserEmail('noorders@example.com');
      expect(orders).toHaveLength(0);
    });

    it('should return orders sorted by newest first', async () => {
      await createTestProduct({ title: 'Another Product', countInStock: 100 });

      // Create second order for user1
      await orderService.createOrder({
        customer: { name: 'User1', email: 'user1@example.com', phone: '123', address: '123 St', city: 'NYC' },
        items: [{ title: 'Another Product', qty: 1, price: 200 }],
        totalAmount: 200,
        paymentMethod: 'COD',
      });

      const orders = await orderService.getOrdersByUserEmail('user1@example.com');
      expect(orders).toHaveLength(2);
      expect(orders[0].createdAt >= orders[1].createdAt).toBe(true);
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      await createTestProduct({ title: 'Test Product', countInStock: 100 });

      await orderService.createOrder({
        customer: { name: 'User1', email: 'user1@example.com', phone: '123', address: '123 St', city: 'NYC' },
        items: [{ title: 'Test Product', qty: 1, price: 100 }],
        totalAmount: 100,
        paymentMethod: 'COD',
      });

      await orderService.createOrder({
        customer: { name: 'User2', email: 'user2@example.com', phone: '456', address: '456 St', city: 'NYC' },
        items: [{ title: 'Test Product', qty: 1, price: 100 }],
        totalAmount: 100,
        paymentMethod: 'COD',
      });

      const orders = await orderService.getAllOrders();
      expect(orders.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getOrderById', () => {
    it('should return order by ID', async () => {
      await createTestProduct({ title: 'Test Product', countInStock: 100 });

      const createdOrder = await orderService.createOrder({
        customer: { name: 'User1', email: 'user1@example.com', phone: '123', address: '123 St', city: 'NYC' },
        items: [{ title: 'Test Product', qty: 1, price: 100 }],
        totalAmount: 100,
        paymentMethod: 'COD',
      });

      const order = await orderService.getOrderById(createdOrder._id.toString());
      expect(order).toBeDefined();
      expect(order._id.toString()).toBe(createdOrder._id.toString());
    });

    it('should throw error for non-existent order', async () => {
      await expect(
        orderService.getOrderById('507f1f77bcf86cd799439011')
      ).rejects.toThrow('Không tìm thấy đơn hàng');
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      await createTestProduct({ title: 'Test Product', countInStock: 100 });

      const createdOrder = await orderService.createOrder({
        customer: { name: 'User1', email: 'user1@example.com', phone: '123', address: '123 St', city: 'NYC' },
        items: [{ title: 'Test Product', qty: 1, price: 100 }],
        totalAmount: 100,
        paymentMethod: 'COD',
      });

      const updatedOrder = await orderService.updateStatus(
        createdOrder._id.toString(),
        'shipping'
      );

      expect(updatedOrder.status).toBe('shipping');
    });

    it('should throw error when updating non-existent order', async () => {
      await expect(
        orderService.updateStatus('507f1f77bcf86cd799439011', 'delivered')
      ).rejects.toThrow('Order not found');
    });
  });
});
