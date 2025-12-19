const productData = require('../data/product.json');

/**
 * Seed Service
 * Handles database seeding operations
 * Extracted from ProductService to follow SRP
 */
class SeedService {
  
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  /**
   * Seed products from JSON file
   * @returns {Promise<Object>}
   */
  async seedProducts() {
    await this.productRepository.deleteAll();
    await this.productRepository.insertMany(productData);
    return { message: "Products seeded successfully" };
  }

  /**
   * Clear all products
   * @returns {Promise<Object>}
   */
  async clearProducts() {
    await this.productRepository.deleteAll();
    return { message: "Products cleared successfully" };
  }

  /**
   * Seed all data (can be extended for other models)
   * @returns {Promise<Object>}
   */
  async seedAll() {
    await this.seedProducts();
    // Add other seed operations here in the future
    return { message: "Database seeded successfully" };
  }
}

module.exports = SeedService;
