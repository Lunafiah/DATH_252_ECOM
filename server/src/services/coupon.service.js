/**
 * Coupon Service
 * Handles coupon management and validation
 * Refactored to use dependency injection (DIP compliance)
 */
class CouponService {
  
  constructor(couponRepository) {
    this.couponRepository = couponRepository;
  }

  /**
   * Create a new coupon
   * @param {Object} data - Coupon data
   * @returns {Promise<Object>}
   */
  async createCoupon(data) {
    const { name, expiry, discount } = data;
    
    // Check for duplicate
    const existingCoupon = await this.couponRepository.findByName(name);
    if (existingCoupon) {
      throw new Error("Mã giảm giá này đã tồn tại!");
    }
    
    return await this.couponRepository.create({ name: name.toUpperCase(), expiry, discount });
  }

  /**
   * Get all coupons
   * @returns {Promise<Array>}
   */
  async listCoupons() {
    return await this.couponRepository.findAllSorted();
  }

  /**
   * Delete a coupon
   * @param {string} id - Coupon ID
   * @returns {Promise<Object>}
   */
  async deleteCoupon(id) {
    return await this.couponRepository.delete(id);
  }

  /**
   * Apply and validate a coupon
   * @param {string} codeName - Coupon code
   * @returns {Promise<Object>}
   */
  async applyCoupon(codeName) {
    const coupon = await this.couponRepository.findByName(codeName);

    if (!coupon) throw new Error("Mã giảm giá không hợp lệ!");

    // Check expiry
    if (new Date() > new Date(coupon.expiry)) {
      throw new Error("Mã giảm giá đã hết hạn!");
    }

    return {
        discount: coupon.discount,
        code: coupon.name,
        message: `Đã áp dụng mã ${coupon.name}! Bạn được giảm ${coupon.discount}%` 
    };
  }
}

module.exports = CouponService;