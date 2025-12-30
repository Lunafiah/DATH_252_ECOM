/**
 * User Service
 * Handles user profile and address management
 * Refactored to use dependency injection (DIP compliance)
 */
class UserService {

  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>}
   */
  async updateProfile(userId, updateData) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('Không tìm thấy người dùng');

    // Update name
    if (updateData.name) user.name = updateData.name;
    
    // Update password (if provided)
    // Note: User Model has 'pre save' middleware to hash password
    if (updateData.password) {
      user.password = updateData.password;
    }

    return await user.save();
  }

  /**
   * Add address to user
   * @param {string} userId - User ID
   * @param {Object} addressData - Address data
   * @returns {Promise<Array>}
   */
  async addAddress(userId, addressData) {
    return await this.userRepository.addAddress(userId, addressData);
  }

  /**
   * Delete address from user
   * @param {string} userId - User ID
   * @param {string} addressId - Address ID
   * @returns {Promise<Array>}
   */
  async deleteAddress(userId, addressId) {
    return await this.userRepository.deleteAddress(userId, addressId);
  }
}

module.exports = UserService;