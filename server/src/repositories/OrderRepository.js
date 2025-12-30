const IRepository = require('./base/IRepository');
const Order = require('../models/order.model');

/**
 * Order Repository
 * Encapsulates all database operations for Order model
 */
class OrderRepository extends IRepository {
  
  async findById(id) {
    return await Order.findById(id);
  }

  async findOne(query) {
    return await Order.findOne(query);
  }

  async find(query = {}, options = {}) {
    let dbQuery = Order.find(query);
    
    if (options.sort) {
      dbQuery = dbQuery.sort(options.sort);
    }
    
    if (options.limit) {
      dbQuery = dbQuery.limit(options.limit);
    }
    
    return await dbQuery;
  }

  async create(data) {
    const order = new Order(data);
    return await order.save();
  }

  async update(id, updateData) {
    const order = await Order.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }
    
    Object.assign(order, updateData);
    return await order.save();
  }

  async delete(id) {
    const order = await Order.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return await order.deleteOne();
  }

  async count(query = {}) {
    return await Order.countDocuments(query);
  }

  // Order-specific methods

  /**
   * Find orders by customer email
   * @param {string} email - Customer email
   * @returns {Promise<Array>}
   */
  async findByCustomerEmail(email) {
    return await Order.find({ "customer.email": email }).sort({ createdAt: -1 });
  }

  /**
   * Find all orders sorted by creation date
   * @returns {Promise<Array>}
   */
  async findAllSorted() {
    return await Order.find({}).sort({ createdAt: -1 });
  }

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>}
   */
  async updateStatus(orderId, status) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    
    order.status = status;
    return await order.save();
  }

  /**
   * Aggregate total revenue
   * @returns {Promise<number>}
   */
  async getTotalRevenue() {
    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);
    
    return revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
  }
}

module.exports = OrderRepository;
