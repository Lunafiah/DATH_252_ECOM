const container = require('../config/container');
const couponService = container.getService('coupon');

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.listCoupons = async (req, res) => {
  try {
    const coupons = await couponService.listCoupons();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    await couponService.deleteCoupon(req.params.id);
    res.json({ message: "Đã xóa mã giảm giá" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await couponService.applyCoupon(name);
    res.json(result);
  } catch (err) {
    // Trả về 400 hoặc 404 tùy logic, ở đây gom chung là lỗi client
    res.status(400).json({ message: err.message });
  }
};