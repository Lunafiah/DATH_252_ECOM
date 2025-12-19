/**
 * Review Service
 * Handles all review-related business logic
 * Extracted from ProductService to follow SRP
 */
class ReviewService {
  
  constructor(reviewRepository, productRepository) {
    this.reviewRepository = reviewRepository;
    this.productRepository = productRepository;
  }

  /**
   * Add a review to a product
   * @param {string} userId - User ID
   * @param {string} userName - User name
   * @param {string} productId - Product ID
   * @param {number} rating - Rating (1-5)
   * @param {string} comment - Review comment
   * @returns {Promise<Object>}
   */
  async addReview(userId, userName, productId, rating, comment) {
    // Get product (handles both MongoDB ID and legacy numeric ID)
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await this.reviewRepository.findByUserAndProduct(
      userId,
      product._id
    );

    if (alreadyReviewed) {
      throw new Error('You have already reviewed this product');
    }

    // Create review
    const review = await this.reviewRepository.create({
      name: userName,
      rating: Number(rating),
      comment,
      user: userId,
      product: product._id
    });

    // Recalculate product rating
    const reviews = await this.reviewRepository.findByProduct(product._id);
    const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
    const averageRating = totalRating / reviews.length;

    await this.productRepository.updateRating(
      product._id,
      averageRating,
      reviews.length
    );

    return { message: 'Review added successfully', review };
  }

  /**
   * Get all reviews for a product
   * @param {string} productId - Product ID
   * @returns {Promise<Array>}
   */
  async getReviews(productId) {
    // Get product (handles both MongoDB ID and legacy numeric ID)
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    return await this.reviewRepository.findByProduct(product._id);
  }

  /**
   * Delete a review
   * @param {string} reviewId - Review ID
   * @param {string} userId - User ID (for authorization)
   * @returns {Promise<Object>}
   */
  async deleteReview(reviewId, userId) {
    const review = await this.reviewRepository.findById(reviewId);
    
    if (!review) {
      throw new Error('Review not found');
    }

    // Only allow user to delete their own review
    if (review.user.toString() !== userId) {
      throw new Error('Not authorized to delete this review');
    }

    await this.reviewRepository.delete(reviewId);

    // Recalculate product rating
    const reviews = await this.reviewRepository.findByProduct(review.product);
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
      const averageRating = totalRating / reviews.length;
      
      await this.productRepository.updateRating(
        review.product,
        averageRating,
        reviews.length
      );
    } else {
      // No reviews left, reset to default
      await this.productRepository.updateRating(review.product, 5, 0);
    }

    return { message: 'Review deleted successfully' };
  }
}

module.exports = ReviewService;
