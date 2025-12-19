/**
 * Dependency Injection Container
 * Central place to instantiate and wire all dependencies
 * This implements the Dependency Inversion Principle
 */

// Repositories
const UserRepository = require('../repositories/UserRepository');
const ProductRepository = require('../repositories/ProductRepository');
const OrderRepository = require('../repositories/OrderRepository');
const CouponRepository = require('../repositories/CouponRepository');
const ReviewRepository = require('../repositories/ReviewRepository');

// Services
const AuthService = require('../services/auth.service');
const UserService = require('../services/user.service');
const ProductService = require('../services/product.service');
const OrderService = require('../services/order.service');
const CouponService = require('../services/coupon.service');
const StatsService = require('../services/stats.service');
const ReviewService = require('../services/review.service');
const SeedService = require('../services/seed.service');
const InventoryService = require('../services/inventory.service');

// Utilities
const JWTTokenService = require('../services/token/JWTTokenService');

/**
 * Container class to manage all dependencies
 */
class Container {
  constructor() {
    this.repositories = {};
    this.services = {};
    this.utils = {};
    
    this._initializeRepositories();
    this._initializeUtils();
    this._initializeServices();
  }

  /**
   * Initialize all repositories
   * @private
   */
  _initializeRepositories() {
    this.repositories.user = new UserRepository();
    this.repositories.product = new ProductRepository();
    this.repositories.order = new OrderRepository();
    this.repositories.coupon = new CouponRepository();
    this.repositories.review = new ReviewRepository();
  }

  /**
   * Initialize utility services
   * @private
   */
  _initializeUtils() {
    this.utils.tokenService = new JWTTokenService();
  }

  /**
   * Initialize all services with their dependencies
   * @private
   */
  _initializeServices() {
    // Auth Service
    this.services.auth = new AuthService(
      this.repositories.user,
      this.utils.tokenService
    );

    // User Service
    this.services.user = new UserService(
      this.repositories.user
    );

    // Product Service
    this.services.product = new ProductService(
      this.repositories.product
    );

    // Inventory Service
    this.services.inventory = new InventoryService(
      this.repositories.product
    );

    // Order Service
    this.services.order = new OrderService(
      this.repositories.order,
      this.services.inventory
    );

    // Coupon Service
    this.services.coupon = new CouponService(
      this.repositories.coupon
    );

    // Stats Service
    this.services.stats = new StatsService(
      this.repositories.order,
      this.repositories.product,
      this.repositories.user
    );

    // Review Service
    this.services.review = new ReviewService(
      this.repositories.review,
      this.repositories.product
    );

    // Seed Service
    this.services.seed = new SeedService(
      this.repositories.product
    );
  }

  /**
   * Get a service by name
   * @param {string} name - Service name
   * @returns {Object} - Service instance
   */
  getService(name) {
    if (!this.services[name]) {
      throw new Error(`Service '${name}' not found in container`);
    }
    return this.services[name];
  }

  /**
   * Get a repository by name
   * @param {string} name - Repository name
   * @returns {Object} - Repository instance
   */
  getRepository(name) {
    if (!this.repositories[name]) {
      throw new Error(`Repository '${name}' not found in container`);
    }
    return this.repositories[name];
  }
}

// Export singleton instance
const container = new Container();

module.exports = container;
