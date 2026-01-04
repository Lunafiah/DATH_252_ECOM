# SOLID Principles Analysis Report

## E-Commerce Application (DATH_252_ECOM)

---

## Executive Summary

This report analyzes the SOLID principles compliance across the e-commerce application's backend and frontend modules. The analysis covers:

- **Backend**: Services, Controllers, Models, Middlewares, Routes
- **Frontend**: Modules (Auth, Products, Orders, Admin, Core)

Overall, the project demonstrates **good adherence** to SOLID principles with some areas for improvement.

---

## 1. Single Responsibility Principle (SRP)

> _A class should have one, and only one, reason to change._

### ✅ **Strengths**

#### Backend Services Layer

All service classes demonstrate excellent SRP compliance:

- **[AuthService](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/services/auth.service.js)**: Solely responsible for authentication operations (register, login, token generation)
- **[UserService](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/services/user.service.js)**: Handles only user profile and address management
- **[ProductService](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/services/product.service.js)**: Manages product CRUD operations, filtering, and review management
- **[OrderService](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/services/order.service.js)**: Focuses on order creation, retrieval, and status updates
- **[CouponService](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/services/coupon.service.js)**: Dedicated to coupon management and validation
- **[StatsService](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/services/stats.service.js)**: Exclusively handles dashboard statistics aggregation

#### Controllers Layer

Controllers act as thin wrappers, delegating business logic to services:

```javascript
// auth.controller.js - Good SRP: Only handles HTTP concerns
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userInfo = await AuthService.register(name, email, password);
    res.status(201).json(userInfo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
```

#### Models Layer

Models focus solely on data structure and schema-related logic:

- **[User Model](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/models/user.model.js)**: Defines schema + password hashing middleware + password comparison method
- **[Product Model](file:///c:/Users/Lunafiah/Desktop/Study/Đồ%20án%20CNPM/DATH_252_ECOM/server/src/models/product.model.js)**: Pure data schema definition

### ⚠️ **Areas for Improvement**

#### ProductService - Multiple Responsibilities

The `ProductService` handles too many concerns:

```javascript
class ProductService {
  // Product CRUD
  async getAllProducts(query) { ... }
  async getProductById(id) { ... }
  async createProduct(productData) { ... }
  async updateProduct(id, updateData) { ... }
  async deleteProduct(id) { ... }

  // Data seeding (infrastructure concern)
  async seedProducts() { ... }

  // Review management (separate domain)
  async addReview(userId, userName, productIdParam, rating, comment) { ... }
  async getReviews(productIdParam) { ... }
}
```

> [!WARNING] > **Recommendation**: Split into separate services:
>
> - `ProductService` - Product CRUD only
> - `ReviewService` - Review management
> - `DataSeedService` - Database seeding operations

#### OrderService - Inventory Management Coupling

The `OrderService.createOrder()` method directly manages product inventory:

```javascript
async createOrder(orderData) {
  // ... inventory management logic mixed with order creation
  for (const item of items) {
    const product = await Product.findOne({ title: item.title });
    if (product.countInStock < item.qty) {
      throw new Error(`Product "${product.title}" out of stock`);
    }
    product.countInStock -= item.qty;
    await product.save();
  }
  // ... order creation
}
```

> [!IMPORTANT] > **Recommendation**: Extract inventory management to a dedicated `InventoryService`

---

## 2. Open/Closed Principle (OCP)

> _Software entities should be open for extension but closed for modification._

### ✅ **Strengths**

#### Mongoose Schema Extension

Models use Mongoose's schema system which allows extension through plugins and virtuals without modifying core code.

#### Service Pattern

The service layer architecture allows adding new services without modifying existing ones.

### ⚠️ **Areas for Improvement**

#### Hardcoded Sorting Logic

`ProductService.getAllProducts()` uses hardcoded sort conditions:

```javascript
let sortOptions = { createdAt: -1 };
if (sort === "price_asc") sortOptions = { price: 1 };
if (sort === "price_desc") sortOptions = { price: -1 };
if (sort === "bestseller") sortOptions = { isBestSeller: -1 };
```

> [!TIP] > **Recommendation**: Use a strategy pattern or configuration object:
>
> ```javascript
> const SORT_STRATEGIES = {
>   price_asc: { price: 1 },
>   price_desc: { price: -1 },
>   bestseller: { isBestSeller: -1 },
>   default: { createdAt: -1 },
> };
>
> const sortOptions = SORT_STRATEGIES[sort] || SORT_STRATEGIES.default;
> ```

#### Token Generation Strategy

`AuthService` hardcodes JWT token generation. Different authentication strategies (OAuth, API keys) would require modifying the class.

> [!TIP] > **Recommendation**: Inject a token generation strategy:
>
> ```javascript
> class AuthService {
>   constructor(tokenStrategy = new JWTTokenStrategy()) {
>     this.tokenStrategy = tokenStrategy;
>   }
>
>   generateToken(id) {
>     return this.tokenStrategy.generate(id);
>   }
> }
> ```

---

## 3. Liskov Substitution Principle (LSP)

> _Derived classes must be substitutable for their base classes._

### ✅ **Strengths**

The project doesn't use classical inheritance extensively, which **avoids LSP violations**. This is actually a good design choice for Node.js applications.

### 📝 **Observations**

- Services are instantiated as singletons: `module.exports = new AuthService();`
- No inheritance hierarchies that could violate LSP
- Mongoose models use composition over inheritance

### ⚠️ **Potential Concerns**

If you were to extend services in the future, ensure:

- Subclasses don't strengthen preconditions
- Subclasses don't weaken postconditions
- Subclasses maintain the same error handling contracts

---

## 4. Interface Segregation Principle (ISP)

> _Clients should not be forced to depend on interfaces they don't use._

### ✅ **Strengths**

#### Focused Service Interfaces

Each service exposes only the methods relevant to its domain:

```javascript
// UserService - Only user-related operations
class UserService {
  async updateProfile(userId, updateData) { ... }
  async addAddress(userId, addressData) { ... }
  async deleteAddress(userId, addressId) { ... }
}
```

#### Controller Separation

Controllers are split by domain (auth, user, product, order, coupon, stats), preventing interface bloat.

### ⚠️ **Areas for Improvement**

#### ProductService Interface Bloat

As mentioned in SRP, `ProductService` exposes too many unrelated methods:

```javascript
// Clients using only product CRUD are forced to see review methods
class ProductService {
  // Product operations
  getAllProducts() { ... }
  getProductById() { ... }

  // Review operations (different concern)
  addReview() { ... }
  getReviews() { ... }

  // Infrastructure operations (different concern)
  seedProducts() { ... }
}
```

> [!WARNING] > **Recommendation**: Split into focused interfaces:
>
> ```javascript
> // IProductRepository
> class ProductService {
>   getAllProducts() { ... }
>   getProductById() { ... }
>   createProduct() { ... }
>   updateProduct() { ... }
>   deleteProduct() { ... }
> }
>
> // IReviewRepository
> class ReviewService {
>   addReview() { ... }
>   getReviews() { ... }
> }
>
> // IDataSeeder
> class SeedService {
>   seedProducts() { ... }
> }
> ```

---

## 5. Dependency Inversion Principle (DIP)

> _High-level modules should not depend on low-level modules. Both should depend on abstractions._

### ⚠️ **Major Violations**

#### Direct Model Dependencies

Services directly import and depend on concrete Mongoose models:

```javascript
// auth.service.js
const User = require("../models/user.model"); // Direct dependency on concrete class

class AuthService {
  async register(name, email, password) {
    const userExists = await User.findOne({ email }); // Tight coupling
    const user = await User.create({ name, email, password });
    // ...
  }
}
```

**Problems**:

- Cannot easily swap database implementations
- Difficult to unit test without database
- Tight coupling to Mongoose/MongoDB

> [!CAUTION] > **Recommendation**: Introduce repository abstractions:
>
> ```javascript
> // repositories/IUserRepository.js
> class IUserRepository {
>   async findByEmail(email) {
>     throw new Error("Not implemented");
>   }
>   async create(userData) {
>     throw new Error("Not implemented");
>   }
> }
>
> // repositories/MongoUserRepository.js
> const User = require("../models/user.model");
>
> class MongoUserRepository extends IUserRepository {
>   async findByEmail(email) {
>     return await User.findOne({ email });
>   }
>
>   async create(userData) {
>     return await User.create(userData);
>   }
> }
>
> // services/auth.service.js
> class AuthService {
>   constructor(userRepository) {
>     this.userRepository = userRepository;
>   }
>
>   async register(name, email, password) {
>     const userExists = await this.userRepository.findByEmail(email);
>     const user = await this.userRepository.create({ name, email, password });
>     // ...
>   }
> }
>
> // Dependency injection
> const userRepo = new MongoUserRepository();
> module.exports = new AuthService(userRepo);
> ```

#### Service Singleton Pattern

Services are exported as singletons without dependency injection:

```javascript
module.exports = new AuthService();
```

**Problems**:

- Hard to test with mocks
- Cannot configure different implementations
- Violates DIP by not depending on abstractions

> [!IMPORTANT] > **Recommendation**: Use dependency injection:
>
> ```javascript
> // Export the class, not the instance
> module.exports = AuthService;
>
> // In a dependency injection container or bootstrap file
> const authService = new AuthService(userRepository, tokenService);
> ```

#### Controllers Depend on Concrete Services

Controllers directly require concrete service implementations:

```javascript
const AuthService = require("../services/auth.service"); // Concrete dependency
```

> [!TIP] > **Recommendation**: Inject services into controllers:
>
> ```javascript
> // controllers/auth.controller.js
> class AuthController {
>   constructor(authService) {
>     this.authService = authService;
>   }
>
>   async registerUser(req, res) {
>     // Use this.authService instead of AuthService
>   }
> }
>
> module.exports = AuthController;
> ```

---

## Summary of Findings

### Overall Grade: **B+ (Good)**

| Principle                 | Grade | Status                                                  |
| ------------------------- | ----- | ------------------------------------------------------- |
| **Single Responsibility** | B+    | Good separation, but `ProductService` needs splitting   |
| **Open/Closed**           | B     | Service pattern is good, but hardcoded logic exists     |
| **Liskov Substitution**   | A     | No inheritance violations (minimal inheritance used)    |
| **Interface Segregation** | B     | Mostly focused interfaces, `ProductService` is bloated  |
| **Dependency Inversion**  | C     | **Major issue**: Direct dependencies on concrete models |

---

## Priority Recommendations

### 🔴 **High Priority**

1. **Implement Repository Pattern** (DIP)

   - Create repository abstractions for all models
   - Inject repositories into services
   - Enable easier testing and database swapping

2. **Split ProductService** (SRP, ISP)
   - Extract `ReviewService`
   - Extract `SeedService` or `DataSeeder`
   - Keep `ProductService` focused on product CRUD

### 🟡 **Medium Priority**

3. **Extract InventoryService** (SRP)

   - Move inventory management out of `OrderService`
   - Create dedicated `InventoryService` for stock operations

4. **Implement Dependency Injection** (DIP)
   - Use constructor injection for services
   - Create a DI container or factory
   - Export classes instead of singletons

### 🟢 **Low Priority**

5. **Refactor Hardcoded Logic** (OCP)

   - Use strategy pattern for sorting
   - Extract token generation strategy
   - Make filtering logic more extensible

6. **Add Service Interfaces** (ISP, DIP)
   - Define TypeScript interfaces or JSDoc contracts
   - Document expected service behaviors
   - Enable easier mocking in tests

---

## Code Examples

### Example: Repository Pattern Implementation

```javascript
// repositories/base/IRepository.js
class IRepository {
  async findById(id) {
    throw new Error("Not implemented");
  }
  async findOne(query) {
    throw new Error("Not implemented");
  }
  async create(data) {
    throw new Error("Not implemented");
  }
  async update(id, data) {
    throw new Error("Not implemented");
  }
  async delete(id) {
    throw new Error("Not implemented");
  }
}

// repositories/UserRepository.js
const User = require("../models/user.model");
const IRepository = require("./base/IRepository");

class UserRepository extends IRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return await User.findById(id);
  }

  async update(id, updateData) {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    Object.assign(user, updateData);
    return await user.save();
  }
}

// services/auth.service.js (Refactored)
class AuthService {
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  async register(name, email, password) {
    const userExists = await this.userRepository.findByEmail(email);
    if (userExists) {
      throw new Error("Email already in use");
    }

    const user = await this.userRepository.create({ name, email, password });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: this.tokenService.generate(user._id),
    };
  }
}

// bootstrap/services.js (Dependency Injection Setup)
const UserRepository = require("../repositories/UserRepository");
const JWTTokenService = require("../services/token/JWTTokenService");
const AuthService = require("../services/auth.service");

const userRepository = new UserRepository();
const tokenService = new JWTTokenService();
const authService = new AuthService(userRepository, tokenService);

module.exports = {
  authService,
  userRepository,
  tokenService,
};
```

---

## Testing Implications

### Current State

- **Difficult to unit test** services due to direct model dependencies
- **Requires database** for all service tests
- **Cannot mock** dependencies easily

### After Implementing Recommendations

- **Easy to unit test** with mocked repositories
- **No database required** for service layer tests
- **Fast test execution** with dependency injection

```javascript
// Example: Testing with mocked repository
describe("AuthService", () => {
  it("should register a new user", async () => {
    // Mock repository
    const mockUserRepo = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        _id: "123",
        name: "Test User",
        email: "test@example.com",
        role: "customer",
      }),
    };

    const mockTokenService = {
      generate: jest.fn().mockReturnValue("mock-token"),
    };

    // Inject mocks
    const authService = new AuthService(mockUserRepo, mockTokenService);

    // Test
    const result = await authService.register(
      "Test User",
      "test@example.com",
      "password"
    );

    expect(result.token).toBe("mock-token");
    expect(mockUserRepo.create).toHaveBeenCalled();
  });
});
```

---

## Conclusion

The project demonstrates **solid architectural foundations** with clear separation of concerns between controllers, services, and models. The main areas for improvement are:

1. **Dependency Inversion**: Implement repository pattern and dependency injection
2. **Single Responsibility**: Split `ProductService` into focused services
3. **Open/Closed**: Replace hardcoded logic with configurable strategies

Implementing these recommendations will significantly improve:

- **Testability**: Easier to write unit tests with mocked dependencies
- **Maintainability**: Clearer boundaries and responsibilities
- **Flexibility**: Easier to swap implementations (e.g., different databases)
- **Scalability**: Better structure for growing codebase

The current architecture is **production-ready** but would benefit from these refactorings for long-term maintainability and team scalability.
