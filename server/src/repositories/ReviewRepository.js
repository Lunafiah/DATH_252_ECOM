const IRepository = require('./base/IRepository');
const Review = require('../models/review.model');

/**
 * Review Repository
 * Encapsulates all database operations for Review model
 */
class ReviewRepository extends IRepository {
  
  async findById(id) {
    return await Review.findById(id);
  }

  async findOne(query) {
    return await Review.findOne(query);
  }

  async find(query = {}, options = {}) {
    let dbQuery = Review.find(query);
    
    if (options.sort) {
      dbQuery = dbQuery.sort(options.sort);
    }
    
    if (options.limit) {
      dbQuery = dbQuery.limit(options.limit);
    }
    
    return await dbQuery;
  }

  async create(data) {
    const review = new Review(data);
    return await review.save();
  }

  async update(id, updateData) {
    const review = await Review.findById(id);
    if (!review) {
      throw new Error('Review not found');
    }
    
    Object.assign(review, updateData);
    return await review.save();
  }

  async delete(id) {
    const review = await Review.findById(id);
    if (!review) {
      throw new Error('Review not found');
    }
    return await review.deleteOne();
  }

  async count(query = {}) {
    return await Review.countDocuments(query);
  }

  // Review-specific methods

  /**
   * Find review by user and product
   * @param {string} userId - User ID
   * @param {string} productId - Product ID
   * @returns {Promise<Object|null>}
   */
  async findByUserAndProduct(userId, productId) {
    return await Review.findOne({
      user: userId,
      product: productId
    });
  }

  /**
   * Find all reviews for a product
   * @param {string} productId - Product ID
   * @returns {Promise<Array>}
   */
  async findByProduct(productId) {
    return await Review.find({ product: productId }).sort({ createdAt: -1 });
  }

  /**
   * Find all reviews by a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>}
   */
  async findByUser(userId) {
    return await Review.find({ user: userId }).sort({ createdAt: -1 });
  }
}

module.exports = ReviewRepository;
