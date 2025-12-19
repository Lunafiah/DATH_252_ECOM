const IRepository = require('./base/IRepository');
const User = require('../models/user.model');

/**
 * User Repository
 * Encapsulates all database operations for User model
 */
class UserRepository extends IRepository {
  
  async findById(id) {
    return await User.findById(id);
  }

  async findOne(query) {
    return await User.findOne(query);
  }

  async find(query = {}, options = {}) {
    let dbQuery = User.find(query);
    
    if (options.sort) {
      dbQuery = dbQuery.sort(options.sort);
    }
    
    if (options.limit) {
      dbQuery = dbQuery.limit(options.limit);
    }
    
    return await dbQuery;
  }

  async create(data) {
    return await User.create(data);
  }

  async update(id, updateData) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    Object.assign(user, updateData);
    return await user.save();
  }

  async delete(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return await user.deleteOne();
  }

  async count(query = {}) {
    return await User.countDocuments(query);
  }

  // User-specific methods

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  /**
   * Add address to user
   * @param {string} userId - User ID
   * @param {Object} addressData - Address data
   * @returns {Promise<Array>}
   */
  async addAddress(userId, addressData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { street, city, phone } = addressData;
    const isDefault = user.addresses.length === 0;
    
    user.addresses.unshift({ street, city, phone, isDefault });
    await user.save();
    
    return user.addresses;
  }

  /**
   * Delete address from user
   * @param {string} userId - User ID
   * @param {string} addressId - Address ID
   * @returns {Promise<Array>}
   */
  async deleteAddress(userId, addressId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== addressId
    );
    
    await user.save();
    return user.addresses;
  }
}

module.exports = UserRepository;
