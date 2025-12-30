# SOLID Refactoring Implementation Plan

## Goal

Refactor the e-commerce backend to fix SOLID principle violations by implementing:

1. **Repository Pattern** (fixes DIP violations)
2. **Service Splitting** (fixes SRP and ISP violations)
3. **Dependency Injection** (fixes DIP violations)
4. **Strategy Pattern** (fixes OCP violations)

This will improve testability, maintainability, and flexibility of the codebase.

## User Review Required

> [!IMPORTANT]
> This refactoring will modify core backend architecture. While the changes maintain backward compatibility at the API level, they significantly restructure internal code organization.

> [!WARNING] > **Breaking Changes for Tests**: Existing unit tests that directly instantiate services will need updates to provide mocked dependencies.

## Proposed Changes

### Phase 1: Repository Layer (DIP Fix)

Create a new repository layer to abstract database operations from business logic.

---

#### [NEW] [IRepository.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/repositories/base/IRepository.js)

Base repository interface defining common CRUD operations.

#### [NEW] [UserRepository.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/repositories/UserRepository.js)

Encapsulates all User model database operations.

#### [NEW] [ProductRepository.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/repositories/ProductRepository.js)

Encapsulates all Product model database operations.

#### [NEW] [OrderRepository.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/repositories/OrderRepository.js)

Encapsulates all Order model database operations.

#### [NEW] [CouponRepository.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/repositories/CouponRepository.js)

Encapsulates all Coupon model database operations.

#### [NEW] [ReviewRepository.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/repositories/ReviewRepository.js)

Encapsulates all Review model database operations.

---

### Phase 2: Service Splitting (SRP & ISP Fix)

Split services with multiple responsibilities into focused, single-purpose services.

---

#### [NEW] [review.service.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/services/review.service.js)

Extract review management from ProductService into dedicated ReviewService.

**Methods**:

- `addReview(userId, userName, productId, rating, comment)`
- `getReviews(productId)`
- `deleteReview(reviewId)`

#### [NEW] [seed.service.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/services/seed.service.js)

Extract data seeding operations into dedicated SeedService.

**Methods**:

- `seedProducts()`
- `seedAll()`
- `clearDatabase()`

#### [NEW] [inventory.service.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/services/inventory.service.js)

Extract inventory management from OrderService into dedicated InventoryService.

**Methods**:

- `checkAvailability(items)`
- `reserveStock(items)`
- `releaseStock(items)`
- `updateStock(productId, quantity)`

#### [MODIFY] [product.service.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/services/product.service.js)

Refactor to focus only on product CRUD operations. Remove review and seed methods. Add dependency injection for ProductRepository.

**Removed Methods**: `addReview()`, `getReviews()`, `seedProducts()`

#### [MODIFY] [order.service.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/services/order.service.js)

Remove inventory management logic. Inject InventoryService and OrderRepository.

#### [MODIFY] [auth.service.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/services/auth.service.js)

Add dependency injection for UserRepository and TokenService.

#### [MODIFY] [user.service.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/services/user.service.js)

Add dependency injection for UserRepository.

#### [MODIFY] [coupon.service.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/services/coupon.service.js)

Add dependency injection for CouponRepository.

#### [MODIFY] [stats.service.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/services/stats.service.js)

Add dependency injection for repositories.

---

### Phase 3: Dependency Injection Container (DIP Fix)

Create a centralized dependency injection system.

---

#### [NEW] [container.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/config/container.js)

Dependency injection container that instantiates and wires all repositories and services.

#### [NEW] [review.controller.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/controllers/review.controller.js)

New controller for review endpoints (extracted from product controller).

#### [MODIFY] [product.controller.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/controllers/product.controller.js)

Remove review endpoints. Update to use injected ProductService from container.

#### [MODIFY] [auth.controller.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/controllers/auth.controller.js)

Update to use injected AuthService from container.

#### [MODIFY] [order.controller.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/controllers/order.controller.js)

Update to use injected OrderService from container.

#### [MODIFY] [user.controller.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/controllers/user.controller.js)

Update to use injected UserService from container.

#### [MODIFY] [coupon.controller.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/controllers/coupon.controller.js)

Update to use injected CouponService from container.

#### [MODIFY] [stats.controller.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/controllers/stats.controller.js)

Update to use injected StatsService from container.

---

### Phase 4: Strategy Pattern (OCP Fix)

Replace hardcoded logic with configurable strategies.

---

#### [NEW] [JWTTokenService.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/services/token/JWTTokenService.js)

Extract token generation into a dedicated service implementing token strategy interface.

#### [NEW] [sortStrategies.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/services/strategies/sortStrategies.js)

Configuration object for product sorting strategies.

---

### Phase 5: Routes Update

Update routes to use new controller structure.

---

#### [MODIFY] [routes/index.js](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/routes/index.js)

Add review routes. Update all routes to use container-injected controllers.

## Verification Plan

### Automated Tests

1. Run existing test suite: `npm test`
2. Verify all tests pass with new architecture
3. Add new repository unit tests with mocked models
4. Add new service unit tests with mocked repositories

### Manual Verification

1. Start server: `npm run dev`
2. Test all API endpoints using Postman/Thunder Client:
   - Auth: Register, Login
   - Products: List, Get, Create, Update, Delete
   - Reviews: Add, Get (new endpoints)
   - Orders: Create, List, Get, Update Status
   - Coupons: Create, List, Apply, Delete
   - Stats: Dashboard
3. Verify database operations work correctly
4. Check error handling and validation
