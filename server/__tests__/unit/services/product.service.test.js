const container = require('../../../src/config/container');
const Product = require('../../../src/models/product.model');
const Review = require('../../../src/models/review.model');
const { createTestProduct, createTestProducts, createTestUser } = require('../../helpers/testUtils');

// Get services from container
const productService = container.getService('product');
const reviewService = container.getService('review');

describe('ProductService', () => {
  describe('getAllProducts', () => {
    beforeEach(async () => {
      // Create test products with different categories and prices
      await createTestProduct({ title: 'Sofa A', category: 'sofa', price: 300 });
      await createTestProduct({ title: 'Sofa B', category: 'sofa', price: 500 });
      await createTestProduct({ title: 'Chair A', category: 'chair', price: 150 });
      await createTestProduct({ title: 'Table A', category: 'table', price: 400 });
    });

    it('should return all products when no filters applied', async () => {
      const products = await productService.getAllProducts({});
      expect(products).toHaveLength(4);
    });

    it('should filter products by category', async () => {
      const products = await productService.getAllProducts({ category: 'sofa' });
      expect(products).toHaveLength(2);
      expect(products.every(p => p.category === 'sofa')).toBe(true);
    });

    it('should filter products by keyword', async () => {
      const products = await productService.getAllProducts({ keyword: 'Sofa' });
      expect(products).toHaveLength(2);
      expect(products.every(p => p.title.includes('Sofa'))).toBe(true);
    });

    it('should filter products by price range', async () => {
      const products = await productService.getAllProducts({ 
        minPrice: 200, 
        maxPrice: 450 
      });
      expect(products.length).toBeGreaterThan(0);
      expect(products.every(p => p.price >= 200 && p.price <= 450)).toBe(true);
    });

    it('should sort products by price ascending', async () => {
      const products = await productService.getAllProducts({ sort: 'price_asc' });
      for (let i = 1; i < products.length; i++) {
        expect(products[i].price).toBeGreaterThanOrEqual(products[i - 1].price);
      }
    });

    it('should sort products by price descending', async () => {
      const products = await productService.getAllProducts({ sort: 'price_desc' });
      for (let i = 1; i < products.length; i++) {
        expect(products[i].price).toBeLessThanOrEqual(products[i - 1].price);
      }
    });
  });

  describe('getProductById', () => {
    it('should get product by MongoDB ObjectId', async () => {
      const testProduct = await createTestProduct({ title: 'Test Product' });
      const product = await productService.getProductById(testProduct._id.toString());
      
      expect(product).toBeDefined();
      expect(product.title).toBe('Test Product');
    });

    it('should get product by legacy numeric ID', async () => {
      const testProduct = await createTestProduct({ id: 999, title: 'Legacy Product' });
      const product = await productService.getProductById('999');
      
      expect(product).toBeDefined();
      expect(product.title).toBe('Legacy Product');
    });

    it('should throw error for non-existent product', async () => {
      await expect(
        productService.getProductById('507f1f77bcf86cd799439011')
      ).rejects.toThrow('Product not found');
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const productData = {
        title: 'New Sofa',
        price: 600,
        description: 'A brand new sofa',
        category: 'sofa',
        image: 'https://example.com/sofa.jpg',
      };

      const product = await productService.createProduct(productData);
      
      expect(product).toBeDefined();
      expect(product.title).toBe('New Sofa');
      expect(product.price).toBe(600);
      expect(product.countInStock).toBe(0); // Default value
    });

    it('should set countInStock if provided', async () => {
      const productData = {
        title: 'Stocked Sofa',
        price: 700,
        category: 'sofa',
        image: 'https://example.com/stocked-sofa.jpg',
        countInStock: 50,
      };

      const product = await productService.createProduct(productData);
      expect(product.countInStock).toBe(50);
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const testProduct = await createTestProduct({ title: 'Old Title', price: 100 });
      
      const updated = await productService.updateProduct(testProduct._id.toString(), {
        title: 'New Title',
        price: 200,
      });

      expect(updated.title).toBe('New Title');
      expect(updated.price).toBe(200);
    });

    it('should throw error when updating non-existent product', async () => {
      await expect(
        productService.updateProduct('507f1f77bcf86cd799439011', { title: 'Test' })
      ).rejects.toThrow('Product not found');
    });
  });

  describe('deleteProduct', () => {
    it('should delete an existing product', async () => {
      const testProduct = await createTestProduct();
      await productService.deleteProduct(testProduct._id.toString());
      
      const product = await Product.findById(testProduct._id);
      expect(product).toBeNull();
    });

    it('should throw error when deleting non-existent product', async () => {
      await expect(
        productService.deleteProduct('507f1f77bcf86cd799439011')
      ).rejects.toThrow('Product not found');
    });
  });
});

// Review tests moved to ReviewService
describe('ReviewService', () => {
  describe('addReview', () => {
    let testProduct;
    let testUser;

    beforeEach(async () => {
      testProduct = await createTestProduct({ 
        title: 'Reviewable Product',
        rating: { rate: 0, count: 0 }
      });
      testUser = await createTestUser();
    });

    it('should add a review to a product', async () => {
      await reviewService.addReview(
        testUser._id,
        testUser.name,
        testProduct._id.toString(),
        5,
        'Excellent product!'
      );

      const reviews = await Review.find({ product: testProduct._id });
      expect(reviews).toHaveLength(1);
      expect(reviews[0].rating).toBe(5);
      expect(reviews[0].comment).toBe('Excellent product!');
    });

    it('should prevent duplicate reviews from same user', async () => {
      // Add first review
      await reviewService.addReview(
        testUser._id,
        testUser.name,
        testProduct._id.toString(),
        5,
        'First review'
      );

      // Try to add second review
      await expect(
        reviewService.addReview(
          testUser._id,
          testUser.name,
          testProduct._id.toString(),
          4,
          'Second review'
        )
      ).rejects.toThrow('You have already reviewed this product');
    });

    it('should recalculate product rating after adding review', async () => {
      const user2 = await createTestUser({ email: 'user2@example.com' });

      // Add first review (5 stars)
      await reviewService.addReview(
        testUser._id,
        testUser.name,
        testProduct._id.toString(),
        5,
        'Great!'
      );

      // Add second review (3 stars)
      await reviewService.addReview(
        user2._id,
        user2.name,
        testProduct._id.toString(),
        3,
        'Good'
      );

      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct.rating.count).toBe(2);
      expect(updatedProduct.rating.rate).toBe(4); // (5 + 3) / 2
    });
  });

  describe('getReviews', () => {
    it('should get all reviews for a product', async () => {
      const testProduct = await createTestProduct();
      const user1 = await createTestUser({ email: 'user1@example.com' });
      const user2 = await createTestUser({ email: 'user2@example.com' });

      await reviewService.addReview(user1._id, user1.name, testProduct._id.toString(), 5, 'Great!');
      await reviewService.addReview(user2._id, user2.name, testProduct._id.toString(), 4, 'Good!');

      const reviews = await reviewService.getReviews(testProduct._id.toString());
      expect(reviews).toHaveLength(2);
    });

    it('should return empty array for product with no reviews', async () => {
      const testProduct = await createTestProduct();
      const reviews = await reviewService.getReviews(testProduct._id.toString());
      expect(reviews).toHaveLength(0);
    });
  });
});
