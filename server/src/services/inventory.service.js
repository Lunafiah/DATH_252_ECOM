/**
 * Inventory Service
 * Handles product inventory management
 * Extracted from OrderService to follow SRP
 */
class InventoryService {
  
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  /**
   * Check if items are available in stock
   * @param {Array} items - Array of {title, qty}
   * @returns {Promise<Object>} - {available: boolean, message: string}
   */
  async checkAvailability(items) {
    for (const item of items) {
      const product = await this.productRepository.findByTitle(item.title);
      
      if (!product) {
        return {
          available: false,
          message: `Product "${item.title}" not found in system`
        };
      }
      
      if (product.countInStock < item.qty) {
        return {
          available: false,
          message: `Product "${product.title}" insufficient stock (Available: ${product.countInStock})`
        };
      }
    }
    
    return { available: true, message: 'All items available' };
  }

  /**
   * Reserve stock for order items
   * @param {Array} items - Array of {title, qty}
   * @returns {Promise<void>}
   */
  async reserveStock(items) {
    // First check availability
    const availability = await this.checkAvailability(items);
    if (!availability.available) {
      throw new Error(availability.message);
    }

    // Reserve stock (subtract quantities)
    for (const item of items) {
      const product = await this.productRepository.findByTitle(item.title);
      await this.productRepository.updateStock(product._id, -item.qty);
    }
  }

  /**
   * Release reserved stock (e.g., when order is cancelled)
   * @param {Array} items - Array of {title, qty}
   * @returns {Promise<void>}
   */
  async releaseStock(items) {
    for (const item of items) {
      const product = await this.productRepository.findByTitle(item.title);
      if (product) {
        await this.productRepository.updateStock(product._id, item.qty);
      }
    }
  }

  /**
   * Update stock for a specific product
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to set
   * @returns {Promise<Object>}
   */
  async updateStock(productId, quantity) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const currentStock = product.countInStock;
    const difference = quantity - currentStock;
    
    return await this.productRepository.updateStock(productId, difference);
  }

  /**
   * Get current stock level
   * @param {string} productId - Product ID
   * @returns {Promise<number>}
   */
  async getStockLevel(productId) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return product.countInStock;
  }
}

module.exports = InventoryService;
