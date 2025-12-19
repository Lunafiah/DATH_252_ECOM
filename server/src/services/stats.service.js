/**
 * Stats Service
 * Handles dashboard statistics
 * Refactored to use dependency injection (DIP compliance)
 */
class StatsService {
  
  constructor(orderRepository, productRepository, userRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.userRepository = userRepository;
  }

  /**
   * Get dashboard statistics
   * @returns {Promise<Object>}
   */
  async getDashboardStats() {
    // 1. Count total orders
    const totalOrders = await this.orderRepository.count();

    // 2. Count total products
    const totalProducts = await this.productRepository.count();

    // 3. Count total customers (exclude admin)
    const totalUsers = await this.userRepository.count({ role: 'customer' });

    // 4. Calculate total revenue
    const totalRevenue = await this.orderRepository.getTotalRevenue();

    return {
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue
    };
  }
}

module.exports = StatsService;