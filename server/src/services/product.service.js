const { getSortStrategy } = require('./strategies/sortStrategies');

/**
 * Product Service
 * Handles product CRUD operations
 * Refactored to use dependency injection and focus on single responsibility
 * Review and seed operations moved to separate services
 */
class ProductService {

  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  /**
   * Get all products with filtering and sorting
   * @param {Object} query - Query parameters
   * @returns {Promise<Array>}
   */
  async getAllProducts(query) {
    const { category, keyword, minPrice, maxPrice, sort } = query;
    let dbQuery = {};

    // Filter logic
    if (category && category !== 'all') dbQuery.category = category;
    if (keyword) dbQuery.title = { $regex: keyword, $options: 'i' };
    if (minPrice || maxPrice) {
      dbQuery.price = {};
      if (minPrice) dbQuery.price.$gte = Number(minPrice);
      if (maxPrice) dbQuery.price.$lte = Number(maxPrice);
    }

    // Get sort strategy (OCP compliance)
    const sortOptions = getSortStrategy(sort);

    return await this.productRepository.find(dbQuery, { sort: sortOptions });
  }

  /**
   * Get product by ID (handles both MongoDB ID and legacy numeric ID)
   * @param {string} id - Product ID
   * @returns {Promise<Object>}
   */
  async getProductById(id) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>}
   */
  async createProduct(productData) {
    const validatedData = this.validateProductData(productData);
    return await this.productRepository.create(validatedData);
  }

  /**
   * Update a product
   * @param {string} id - Product ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>}
   */
  async updateProduct(id, updateData) {
    return await this.productRepository.update(id, updateData);
  }

  /**
   * Delete a product
   * @param {string} id - Product ID
   * @returns {Promise<Object>}
   */
  async deleteProduct(id) {
    return await this.productRepository.delete(id);
  }

  validateProductData(productData) {
    const requiredFields = ['title', 'price', 'category', 'image'];
    const missingFields = requiredFields.filter(field => !productData[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate fabrics if exists
    if (productData.fabrics && Array.isArray(productData.fabrics)) {
        productData.fabrics = productData.fabrics.filter(fabric => 
            fabric.name && fabric.image // Chỉ giữ fabric hợp lệ
        );
    }
    
    // Set defaults
    return {
        ...productData,
        rating: productData.rating || { rate: 5, count: 0 },
        countInStock: Number(productData.countInStock) || 0,
        isOnSale: productData.isOnSale || false,
        salePercentage: productData.salePercentage || 0,
        isBestSeller: productData.isBestSeller || false,
        fabrics: productData.fabrics || []
    };
}

}

module.exports = ProductService;
