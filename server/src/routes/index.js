const express = require('express');
const router = express.Router();

// Import Controllers
const { registerUser, loginUser } = require('../controllers/auth.controller');
const { getProducts, getProductById, seedProducts, createProduct, deleteProduct, updateProduct } = require('../controllers/product.controller');
const { createReview, getReviews, deleteReview } = require('../controllers/review.controller');
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getOrderById } = require('../controllers/order.controller');
const { protect, admin } = require('../middlewares/authMiddleware');
const { getDashboardStats } = require('../controllers/stats.controller');
const { updateUserProfile, addAddress, deleteAddress } = require('../controllers/user.controller');
const { createCoupon, listCoupons, deleteCoupon, applyCoupon } = require('../controllers/coupon.controller');
const uploadRoutes = require('./upload_routes');
// --- AUTH ---
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);

// --- PRODUCTS ---
router.get('/products', getProducts);
router.get('/products/seed', protect, admin, seedProducts);
router.get('/products/:id', getProductById);
router.post('/products', protect, admin, createProduct);
router.delete('/products/:id', protect, admin, deleteProduct);
router.put('/products/:id', protect, admin, updateProduct);

// --- REVIEWS (Separated from products for SRP) ---
router.post('/products/:productId/reviews', protect, createReview);
router.get('/products/:productId/reviews', getReviews);
router.delete('/reviews/:id', protect, deleteReview);

// --- ORDERS ---
router.post('/orders', createOrder);
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);
router.get('/orders/mine', protect, getMyOrders);
router.get('/orders/:id', protect, getOrderById);

// --- STATS ---
router.get('/stats', protect, admin, getDashboardStats);

// --- USERS ---
router.put('/users/profile', protect, updateUserProfile);
router.post('/users/address', protect, addAddress);
router.delete('/users/address/:id', protect, deleteAddress);

// --- COUPONS ---
router.post('/coupons/apply', applyCoupon);
router.post('/coupons', protect, admin, createCoupon);
router.get('/coupons', protect, admin, listCoupons);
router.delete('/coupons/:id', protect, admin, deleteCoupon);

// --- UPLOAD ---
router.use('/upload', uploadRoutes);
module.exports = router;
