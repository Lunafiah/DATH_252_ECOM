/**
 * Order Service
 * Handles order management
 * Refactored to use dependency injection and delegate inventory to InventoryService
 */
class OrderService {
  
  constructor(orderRepository, inventoryService) {
    this.orderRepository = orderRepository;
    this.inventoryService = inventoryService;
  }

  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>}
   */
  async createOrder(orderData) {
    const { items } = orderData;

    // Reserve stock using InventoryService (SRP compliance)
    await this.inventoryService.reserveStock(items);

    // Create order after successful stock reservation
    const order = await this.orderRepository.create(orderData);
    return order;
  }

  /**
   * Get orders by customer email
   * @param {string} email - Customer email
   * @returns {Promise<Array>}
   */
  async getOrdersByUserEmail(email) {
    return await this.orderRepository.findByCustomerEmail(email);
  }

  /**
   * Get all orders (Admin)
   * @returns {Promise<Array>}
   */
  async getAllOrders() {
    return await this.orderRepository.findAllSorted();
  }

  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>}
   */
  async getOrderById(orderId) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new Error('Không tìm thấy đơn hàng');
    return order;
  }

  /**
   * Update order status (Admin)
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>}
   */
  async updateStatus(orderId, status) {
    return await this.orderRepository.updateStatus(orderId, status);
  }
}

module.exports = OrderService;
