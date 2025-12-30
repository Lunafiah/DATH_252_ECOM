/**
 * Product Sorting Strategies
 * Configuration object for different sorting options
 * Implements strategy pattern for OCP compliance
 */

const SORT_STRATEGIES = {
  // Price: Low to High
  price_asc: { price: 1 },
  
  // Price: High to Low
  price_desc: { price: -1 },
  
  // Best Sellers
  bestseller: { isBestSeller: -1, createdAt: -1 },
  
  // Newest First
  newest: { createdAt: -1 },
  
  // Oldest First
  oldest: { createdAt: 1 },
  
  // Highest Rated
  rating_desc: { 'rating.rate': -1 },
  
  // Default sorting
  default: { createdAt: -1 }
};

/**
 * Get sort options for a given sort key
 * @param {string} sortKey - Sort key (e.g., 'price_asc', 'bestseller')
 * @returns {Object} - MongoDB sort options
 */
function getSortStrategy(sortKey) {
  return SORT_STRATEGIES[sortKey] || SORT_STRATEGIES.default;
}

module.exports = {
  SORT_STRATEGIES,
  getSortStrategy
};
