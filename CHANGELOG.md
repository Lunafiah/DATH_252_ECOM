# Changelog

All notable changes to the LUXURIA E-Commerce project are documented here.

---

## [2.0.0] - 2025-12-19

### 🏗️ Major Architecture Refactoring - SOLID Principles

Complete backend refactoring to implement SOLID principles, improving testability, maintainability, and flexibility.

#### Added

**Repository Layer (6 new files)**

- `server/src/repositories/base/IRepository.js` - Base repository interface
- `server/src/repositories/UserRepository.js` - User data access layer
- `server/src/repositories/ProductRepository.js` - Product data access layer
- `server/src/repositories/OrderRepository.js` - Order data access layer
- `server/src/repositories/CouponRepository.js` - Coupon data access layer
- `server/src/repositories/ReviewRepository.js` - Review data access layer

**New Services (3 files)**

- `server/src/services/review.service.js` - Review management (extracted from ProductService)
- `server/src/services/seed.service.js` - Database seeding (extracted from ProductService)
- `server/src/services/inventory.service.js` - Stock management (extracted from OrderService)

**Strategy Pattern (2 files)**

- `server/src/services/token/JWTTokenService.js` - Token generation strategy
- `server/src/services/strategies/sortStrategies.js` - Product sorting strategies

**Dependency Injection**

- `server/src/config/container.js` - Centralized DI container

**New Controller**

- `server/src/controllers/review.controller.js` - Review endpoints

#### Changed

**All Services Refactored (6 files)**

- `auth.service.js` - Now uses UserRepository and TokenService via DI
- `user.service.js` - Now uses UserRepository via DI
- `product.service.js` - Focused on CRUD only, removed review/seed methods
- `order.service.js` - Now uses OrderRepository and InventoryService via DI
- `coupon.service.js` - Now uses CouponRepository via DI
- `stats.service.js` - Now uses repositories via DI

**All Controllers Updated (7 files)**

- All controllers now use DI container to get service instances
- Review endpoints moved from ProductController to ReviewController

**Routes**

- `server/src/routes/index.js` - Added review routes

#### Benefits

- ✅ **Single Responsibility Principle (SRP)**: Each service has one clear purpose
- ✅ **Open/Closed Principle (OCP)**: Extensible via strategies, not modification
- ✅ **Liskov Substitution Principle (LSP)**: No inheritance violations
- ✅ **Interface Segregation Principle (ISP)**: Focused, minimal interfaces
- ✅ **Dependency Inversion Principle (DIP)**: Services depend on abstractions

---

## [1.5.0] - 2025-12-19

### 🧪 Testing Infrastructure Implementation

Comprehensive testing infrastructure with 106 tests covering all critical backend functionality.

#### Added

**Test Configuration**

- `server/jest.config.js` - Jest configuration with coverage thresholds
- `server/__tests__/setup.js` - MongoDB Memory Server global setup
- `server/__tests__/helpers/testUtils.js` - Reusable test utilities
- `server/.gitignore` - Test artifacts exclusion

**Unit Tests - Services (7 files, 71 tests)**

- `server/__tests__/unit/services/auth.service.test.js` - 9 tests
- `server/__tests__/unit/services/product.service.test.js` - 18 tests
- `server/__tests__/unit/services/order.service.test.js` - 12 tests
- `server/__tests__/unit/services/coupon.service.test.js` - 10 tests
- `server/__tests__/unit/services/user.service.test.js` - 9 tests
- `server/__tests__/unit/services/stats.service.test.js` - 3 tests
- `server/__tests__/unit/middlewares/auth.middleware.test.js` - 8 tests

**Integration Tests - API Endpoints (4 files, 28 tests)**

- `server/__tests__/integration/auth.routes.test.js` - 7 tests
- `server/__tests__/integration/product.routes.test.js` - 11 tests
- `server/__tests__/integration/order.routes.test.js` - 7 tests
- `server/__tests__/integration/coupon.routes.test.js` - 8 tests

**Documentation**

- `server/TESTING.md` - Comprehensive testing guide (deleted later)
- `server/TESTING_IMPLEMENTATION_SUMMARY.md` - Complete implementation summary

**Package Updates**

- Added `jest@^29.7.0` to devDependencies
- Added `supertest@^6.3.3` to devDependencies
- Added `mongodb-memory-server@^9.1.0` to devDependencies
- Added `@types/jest@^29.5.0` to devDependencies

**Test Scripts in package.json**

```json
{
  "test": "jest --watchAll --verbose",
  "test:ci": "jest --ci --coverage",
  "test:unit": "jest __tests__/unit --verbose",
  "test:integration": "jest __tests__/integration --verbose"
}
```

#### Test Coverage

- **Total Tests**: 106
- **Passing Tests**: 106 (100%)
- **Statements**: 85.71%
- **Branches**: 91.11%
- **Functions**: 83.01%
- **Lines**: 85.07%

#### Critical Business Logic Tested

- ✅ Inventory management (stock deduction on orders)
- ✅ Duplicate prevention (reviews, coupons, emails)
- ✅ Authorization & security (JWT, admin roles)
- ✅ Data validation (expiry dates, stock levels)

#### Changed

**Model Fixes**

- `server/src/models/user.model.js` - Fixed Mongoose pre-save middleware to use modern async/await

**Test Fixes**

- Updated error message expectations to match SOLID refactoring changes
- Fixed Vietnamese/English error message inconsistencies
- Added required `image` field to product test data
- Updated Order model test data to match schema (customer.address, customer.city, totalAmount)

---

## [1.0.0] - Initial Release

### Features

**Frontend**

- React-based storefront with Redux Toolkit state management
- Product browsing with filtering and search
- Shopping cart with selective checkout
- User authentication and profile management
- Order tracking and history
- Product reviews and ratings

**Backend**

- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- JWT authentication
- Role-based access control (Customer/Admin)
- Admin dashboard for product and order management
- Coupon system

**UI/UX**

- Minimalist luxury design
- Responsive layout with Bootstrap 5
- Smooth animations with Framer Motion

---

## Migration Guide

### From 1.x to 2.0

**Breaking Changes for Tests**

If you have custom tests that directly instantiate services, update them to use the DI container:

```javascript
// Before
const AuthService = require('./auth.service');
await AuthService.register(...);

// After
const container = require('../config/container');
const authService = container.getService('auth');
await authService.register(...);
```

**API Compatibility**

All API endpoints remain backward compatible. No changes required for frontend integration.

**Error Messages**

Some error messages have been standardized to English. Update any error handling that relies on specific Vietnamese error messages.

---

## Contributors

- Development Team - LUXURIA E-Commerce Project
- Architecture Refactoring - SOLID Principles Implementation
- Testing Infrastructure - Comprehensive Test Suite

---

## Links

- [Implementation Plan](./implementation_plan.md) - SOLID refactoring plan
- [Testing Walkthrough](./testing_walkthrough.md) - Testing implementation details
- [Task Checklist](./task.md) - SOLID refactoring tasks
- [Testing Tasks](./testing_task.md) - Testing implementation tasks
