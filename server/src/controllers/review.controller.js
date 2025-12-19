const container = require('../config/container');
const reviewService = container.getService('review');

/**
 * Review Controller
 * Handles HTTP requests for product reviews
 * Extracted from product controller to follow SRP
 */

// 1. Create Review
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;
    
    // req.user from auth middleware
    const result = await reviewService.addReview(
      req.user._id,
      req.user.name,
      productId,
      rating,
      comment
    );
    
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 2. Get Reviews for a Product
exports.getReviews = async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviews = await reviewService.getReviews(productId);
    res.json(reviews);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// 3. Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user._id;
    
    const result = await reviewService.deleteReview(reviewId, userId);
    res.json(result);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};
