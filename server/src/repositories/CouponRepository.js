const IRepository = require('./base/IRepository');
const Coupon = require('../models/coupon.model');

/**
 * Coupon Repository
 * Encapsulates all database operations for Coupon model
 */
class CouponRepository extends IRepository {
  
  async findById(id) {
    return await Coupon.findById(id);
  }

  async findOne(query) {
    return await Coupon.findOne(query);
  }

  async find(query = {}, options = {}) {
    let dbQuery = Coupon.find(query);
    
    if (options.sort) {
      dbQuery = dbQuery.sort(options.sort);
    }
    
    if (options.limit) {
      dbQuery = dbQuery.limit(options.limit);
    }
    
    return await dbQuery;
  }

  async create(data) {
    return await new Coupon(data).save();
  }

  async update(id, updateData) {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      throw new Error('Coupon not found');
    }
    
    Object.assign(coupon, updateData);
    return await coupon.save();
  }

  async delete(id) {
    return await Coupon.findByIdAndDelete(id);
  }

  async count(query = {}) {
    return await Coupon.countDocuments(query);
  }

  // Coupon-specific methods

  /**
   * Find coupon by name (case-insensitive)
   * @param {string} name - Coupon name/code
   * @returns {Promise<Object|null>}
   */
  async findByName(name) {
    return await Coupon.findOne({ name: name.toUpperCase() });
  }

  /**
   * Find all coupons sorted by creation date
   * @returns {Promise<Array>}
   */
  async findAllSorted() {
    return await Coupon.find({}).sort({ createdAt: -1 });
  }
}

module.exports = CouponRepository;
