const IRepository = require('./base/IRepository');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

/**
 * Product Repository
 * Encapsulates all database operations for Product model
 */
class ProductRepository extends IRepository {
  
  async findById(id) {
    // Handle both MongoDB ObjectId and legacy numeric ID
    if (mongoose.Types.ObjectId.isValid(id)) {
      return await Product.findById(id);
    } else {
      return await Product.findOne({ id: parseInt(id) });
    }
  }

  async findOne(query) {
    return await Product.findOne(query);
  }

  async find(query = {}, options = {}) {
    let dbQuery = Product.find(query);
    
    if (options.sort) {
      dbQuery = dbQuery.sort(options.sort);
    }
    
    if (options.limit) {
      dbQuery = dbQuery.limit(options.limit);
    }
    
    return await dbQuery;
  }

  async create(data) {
    const product = new Product({
      ...data,
      countInStock: data.countInStock || 0
    });
    return await product.save();
  }

  async update(id, updateData) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    
    Object.assign(product, updateData);
    return await product.save();
  }

  async delete(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return await product.deleteOne();
  }

  async count(query = {}) {
    return await Product.countDocuments(query);
  }

  // Product-specific methods

  /**
   * Find product by title
   * @param {string} title - Product title
   * @returns {Promise<Object|null>}
   */
  async findByTitle(title) {
    return await Product.findOne({ title });
  }

  /**
   * Update product stock
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to add/subtract (negative to subtract)
   * @returns {Promise<Object>}
   */
  async updateStock(productId, quantity) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    
    product.countInStock += quantity;
    return await product.save();
  }

  /**
   * Update product rating
   * @param {string} productId - Product ID
   * @param {number} rate - New rating value
   * @param {number} count - New rating count
   * @returns {Promise<Object>}
   */
  async updateRating(productId, rate, count) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    
    product.rating.rate = rate;
    product.rating.count = count;
    return await product.save();
  }

  /**
   * Delete all products (for seeding)
   * @returns {Promise<void>}
   */
  async deleteAll() {
    return await Product.deleteMany({});
  }

  /**
   * Insert many products (for seeding)
   * @param {Array} products - Array of product data
   * @returns {Promise<Array>}
   */
  async insertMany(products) {
    return await Product.insertMany(products);
  }

  async create(data) {
    // Tạo ID tự động nếu không có
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const nextId = lastProduct ? lastProduct.id + 1 : 1;
    
    const product = new Product({
        ...data,
        id: data.id || nextId, // Tạo ID tự động
        countInStock: data.countInStock || 0,
        rating: data.rating || { rate: 5, count: 0 }
    });
    return await product.save();
  } 
}

module.exports = ProductRepository;
