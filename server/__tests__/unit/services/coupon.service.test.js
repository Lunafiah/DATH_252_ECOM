const container = require('../../../src/config/container');
const Coupon = require('../../../src/models/coupon.model');

// Get service from container
const couponService = container.getService('coupon');

describe('CouponService', () => {
  describe('createCoupon', () => {
    it('should create a new coupon', async () => {
      const couponData = {
        name: 'SUMMER2024',
        expiry: new Date('2024-12-31'),
        discount: 20,
      };

      const coupon = await couponService.createCoupon(couponData);

      expect(coupon).toBeDefined();
      expect(coupon.name).toBe('SUMMER2024');
      expect(coupon.discount).toBe(20);
    });

    it('should convert coupon name to uppercase', async () => {
      const couponData = {
        name: 'winter2024',
        expiry: new Date('2024-12-31'),
        discount: 15,
      };

      const coupon = await couponService.createCoupon(couponData);
      expect(coupon.name).toBe('WINTER2024');
    });

    it('should throw error when creating duplicate coupon', async () => {
      const couponData = {
        name: 'DUPLICATE',
        expiry: new Date('2024-12-31'),
        discount: 10,
      };

      await couponService.createCoupon(couponData);

      await expect(
        couponService.createCoupon(couponData)
      ).rejects.toThrow('Mã giảm giá này đã tồn tại!');
    });
  });

  describe('listCoupons', () => {
    beforeEach(async () => {
      await couponService.createCoupon({
        name: 'COUPON1',
        expiry: new Date('2024-12-31'),
        discount: 10,
      });

      await couponService.createCoupon({
        name: 'COUPON2',
        expiry: new Date('2024-12-31'),
        discount: 20,
      });
    });

    it('should return all coupons', async () => {
      const coupons = await couponService.listCoupons();
      expect(coupons.length).toBeGreaterThanOrEqual(2);
    });

    it('should return coupons sorted by newest first', async () => {
      const coupons = await couponService.listCoupons();
      for (let i = 1; i < coupons.length; i++) {
        expect(coupons[i - 1].createdAt >= coupons[i].createdAt).toBe(true);
      }
    });
  });

  describe('deleteCoupon', () => {
    it('should delete a coupon', async () => {
      const coupon = await couponService.createCoupon({
        name: 'DELETEME',
        expiry: new Date('2024-12-31'),
        discount: 5,
      });

      await couponService.deleteCoupon(coupon._id.toString());

      const deletedCoupon = await Coupon.findById(coupon._id);
      expect(deletedCoupon).toBeNull();
    });
  });

  describe('applyCoupon', () => {
    beforeEach(async () => {
      // Create a valid coupon
      await couponService.createCoupon({
        name: 'VALID20',
        expiry: new Date('2099-12-31'), // Far future date
        discount: 20,
      });

      // Create an expired coupon
      await couponService.createCoupon({
        name: 'EXPIRED10',
        expiry: new Date('2020-01-01'), // Past date
        discount: 10,
      });
    });

    it('should apply a valid coupon', async () => {
      const result = await couponService.applyCoupon('VALID20');

      expect(result).toHaveProperty('discount', 20);
      expect(result).toHaveProperty('code', 'VALID20');
      expect(result).toHaveProperty('message');
      expect(result.message).toContain('20%');
    });

    it('should be case-insensitive when applying coupon', async () => {
      const result = await couponService.applyCoupon('valid20');
      expect(result.discount).toBe(20);
    });

    it('should throw error for invalid coupon code', async () => {
      await expect(
        couponService.applyCoupon('INVALID')
      ).rejects.toThrow('Mã giảm giá không hợp lệ!');
    });

    it('should throw error for expired coupon', async () => {
      await expect(
        couponService.applyCoupon('EXPIRED10')
      ).rejects.toThrow('Mã giảm giá đã hết hạn!');
    });

    it('should return correct discount percentage', async () => {
      const result = await couponService.applyCoupon('VALID20');
      expect(result.discount).toBe(20);
      expect(typeof result.discount).toBe('number');
    });
  });
});
