# LUXURIA - Luxury Furniture E-Commerce 🛋️

> **Version 2.0** - Enterprise-grade e-commerce platform with SOLID architecture and comprehensive testing

Dự án website thương mại điện tử chuyên về nội thất cao cấp, được xây dựng theo kiến trúc MERN Stack (MongoDB, Express, React, Node.js) với các tiêu chuẩn kỹ thuật nâng cao.

[![Tests](https://img.shields.io/badge/tests-106%20passing-brightgreen)](./server/__tests__)
[![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)](./server/jest.config.js)
[![SOLID](https://img.shields.io/badge/architecture-SOLID-blue)](./implementation_plan.md)

---

## 🎯 Điểm Nổi Bật Phiên Bản 2.0

### ✨ Kiến Trúc SOLID

- **Repository Pattern**: Tách biệt hoàn toàn business logic và data access
- **Dependency Injection**: Dễ dàng test và mở rộng
- **Strategy Pattern**: Linh hoạt trong sorting và token generation
- **Service Splitting**: Mỗi service có trách nhiệm rõ ràng

### 🧪 Testing Infrastructure

- **106 comprehensive tests** với 100% pass rate
- **85%+ code coverage** trên toàn bộ backend
- **MongoDB Memory Server** cho test isolation
- **CI/CD ready** với automated testing

### 🏗️ Kiến Trúc Phân Tầng

```
┌─────────────────────────────────────────┐
│         Controllers (API Layer)         │
│  ┌─────────────────────────────────┐   │
│  │   Dependency Injection Container │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Services (Business Logic)       │
│  • AuthService    • ProductService      │
│  • OrderService   • ReviewService       │
│  • UserService    • InventoryService    │
│  • CouponService  • StatsService        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Repositories (Data Access)         │
│  • UserRepository    • ProductRepository│
│  • OrderRepository   • ReviewRepository │
│  • CouponRepository                     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Models (MongoDB/Mongoose)       │
└─────────────────────────────────────────┘
```

---

## 🚀 Công Nghệ Sử Dụng

### Frontend

- **ReactJS** - UI library
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Bootstrap 5** - CSS framework
- **Framer Motion** - Animations
- **React Router v6** - Routing

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing

### Testing

- **Jest** - Test framework
- **Supertest** - API testing
- **MongoDB Memory Server** - Test database

### DevOps

- **Git** - Version control
- **MongoDB Atlas** - Cloud database
- **Postman** - API testing

---

## ✨ Tính Năng

### 👤 Khách Hàng (Storefront)

**Sản Phẩm**

- 🔍 Tìm kiếm & lọc theo tên, danh mục, khoảng giá
- 📊 Sắp xếp đa dạng (giá, bestseller, mới nhất)
- 🎨 Xem chi tiết với tùy chọn biến thể (màu sắc/vải)
- ⭐ Đánh giá & bình luận sản phẩm
- 🔗 Sản phẩm liên quan

**Giỏ Hàng & Thanh Toán**

- 🛒 Selective Checkout (chọn từng món để thanh toán)
- ➕➖ Tăng giảm số lượng theo tồn kho thực tế
- 💳 Giao diện checkout chia đôi màn hình
- 🎟️ Hỗ trợ mã giảm giá (Coupon)
- 📝 Tự động điền thông tin từ profile

**Tài Khoản**

- 👤 Quản lý hồ sơ cá nhân
- 📍 Sổ địa chỉ (Address Book)
- 📦 Lịch sử đơn hàng
- 🚚 Theo dõi trạng thái đơn hàng

### 🛡️ Quản Trị Viên (Admin Portal)

**Dashboard**

- 📊 Biểu đồ thống kê doanh thu
- 📈 Số lượng đơn hàng, khách hàng
- 📉 Phân tích xu hướng

**Quản Lý**

- 📦 Sản phẩm: CRUD, quản lý tồn kho
- 🛍️ Đơn hàng: Xem danh sách, cập nhật trạng thái
- 🎟️ Marketing: Tạo và quản lý mã giảm giá
- 👥 Người dùng: Quản lý tài khoản

---

## 🛠️ Hướng Dẫn Cài Đặt

### Yêu Cầu

- Node.js (v14 trở lên)
- MongoDB Atlas account
- Git

### Bước 1: Clone Dự Án

```bash
git clone <LINK_GITHUB_CUA_BAN>
cd DATH_252_ECOM
```

### Bước 2: Cài Đặt Dependencies

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd ..
npm install
```

### Bước 3: Cấu Hình Môi Trường

Tạo file `.env` trong thư mục `server/`:

```env
# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/luxuria_shop?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_secret_key_here

# Server
PORT=5001
NODE_ENV=development
```

### Bước 4: Khởi Chạy

**Backend (Terminal 1):**

```bash
cd server
npm run dev
```

✅ Server chạy tại `http://localhost:5001`

**Frontend (Terminal 2):**

```bash
npm start
```

✅ App mở tại `http://localhost:3000`

---

## 🧪 Testing

### Chạy Tests

```bash
cd server

# Run all tests
npm test

# Run with coverage
npm run test:ci

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

### Test Coverage

```
Test Suites: 11 passed, 11 total
Tests:       106 passed, 106 total
Coverage:    85.71% statements
             91.11% branches
             83.01% functions
             85.07% lines
```

### Test Structure

```
server/__tests__/
├── setup.js                    # Global test setup
├── helpers/
│   └── testUtils.js           # Test utilities
├── unit/
│   ├── services/              # Service layer tests
│   └── middlewares/           # Middleware tests
└── integration/               # API endpoint tests
```

Xem thêm: [Testing Documentation](./server/TESTING_IMPLEMENTATION_SUMMARY.md)

---

## 📚 Tài Liệu Kỹ Thuật

### Kiến Trúc & Thiết Kế

- [SOLID Principles Analysis](./solid_principles_analysis.md) - Phân tích vi phạm SOLID
- [Implementation Plan](./implementation_plan.md) - Kế hoạch refactoring
- [Walkthrough](./walkthrough.md) - Hướng dẫn chi tiết SOLID refactoring
- [Task Checklist](./task.md) - Danh sách công việc

### Testing

- [Testing Implementation Summary](./server/TESTING_IMPLEMENTATION_SUMMARY.md) - Tổng quan testing

### Changelog

- [CHANGELOG.md](./CHANGELOG.md) - Lịch sử thay đổi chi tiết

---

## 📁 Cấu Trúc Thư Mục

```
DATH_252_ECOM/
├── server/                    # Backend
│   ├── src/
│   │   ├── config/           # Configuration & DI Container
│   │   ├── controllers/      # API Controllers
│   │   ├── services/         # Business Logic
│   │   ├── repositories/     # Data Access Layer
│   │   ├── models/           # MongoDB Models
│   │   ├── middlewares/      # Express Middlewares
│   │   └── routes/           # API Routes
│   ├── __tests__/            # Test Suite
│   │   ├── unit/            # Unit Tests
│   │   ├── integration/     # Integration Tests
│   │   └── helpers/         # Test Utilities
│   └── package.json
├── src/                      # Frontend
│   ├── components/          # React Components
│   ├── pages/              # Page Components
│   ├── redux/              # Redux Store
│   ├── hooks/              # Custom Hooks
│   └── services/           # API Services
└── public/                  # Static Assets
```

---

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

### Products

- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Reviews

- `POST /api/products/:id/reviews` - Thêm đánh giá
- `GET /api/products/:id/reviews` - Xem đánh giá
- `DELETE /api/reviews/:id` - Xóa đánh giá

### Orders

- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders/mine` - Đơn hàng của tôi
- `GET /api/orders` - Tất cả đơn hàng (Admin)
- `PUT /api/orders/:id/status` - Cập nhật trạng thái (Admin)

### Coupons

- `POST /api/coupons` - Tạo mã giảm giá (Admin)
- `GET /api/coupons` - Danh sách mã (Admin)
- `POST /api/coupons/apply` - Áp dụng mã
- `DELETE /api/coupons/:id` - Xóa mã (Admin)

### Users

- `GET /api/users/profile` - Xem profile
- `PUT /api/users/profile` - Cập nhật profile
- `POST /api/users/addresses` - Thêm địa chỉ
- `DELETE /api/users/addresses/:id` - Xóa địa chỉ

### Stats

- `GET /api/stats/dashboard` - Dashboard statistics (Admin)

---

## 🎨 UI/UX Design

- **Phong cách**: Minimalist Luxury
- **Màu sắc**: Neutral tones với gold accents
- **Typography**: Clean, modern fonts
- **Animations**: Subtle, smooth transitions
- **Responsive**: Mobile-first approach

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Run tests (`npm test`)
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Team

- **Development Team** - LUXURIA E-Commerce Project
- **Architecture** - SOLID Principles Implementation
- **Testing** - Comprehensive Test Suite

---

## 📞 Support

For issues and questions:

- Create an issue on GitHub
- Contact the development team

---

**Built with ❤️ using MERN Stack**
