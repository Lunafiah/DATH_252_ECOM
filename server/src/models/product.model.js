const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // --- CÁC TRƯỜNG CŨ GIỮ NGUYÊN ---
  id: { type: Number }, // ID số (nếu bạn dùng để seed data cũ)
  title: { type: String, required: true, index: 'text' },
  price: { type: Number, required: true },
  description: String,
  category: { type: String, required: true },
  image: { type: String, required: true }, // Ảnh chính
  rating: { rate: { type: Number, default: 5 }, count: { type: Number, default: 0 } },
  isBestSeller: { type: Boolean, default: false },

  // --- 👇 CÁC TRƯỜNG MỚI CHO GIAO DIỆN LUXURY 👇 ---

  // 1. ẢNH BẢN VẼ KỸ THUẬT (Hiện ở phần Dimensions bên dưới)
  // Tôi để link ảnh mẫu của King Living làm mặc định để bạn test giao diện ngay
  dimensionImage: { 
    type: String, 
    default: "https://www.kingliving.com.au/media/catalog/product/cache/78e8f8a556b46859345c26b86f444850/z/a/zaza_2s_dims_1.jpg" 
  }, 

  // 2. DANH SÁCH TUỲ CHỌN VẢI/DA (Swatch)
  fabrics: [
      {
          name: { type: String, required: true }, // VD: "Prestige Silk"
          image: { type: String, required: true }, // Link ảnh miếng vải nhỏ
          extraPrice: { type: Number, default: 0 } // Giá cộng thêm. VD: 654 (USD)
      }
  ],

  // 3. THÔNG TIN CHI TIẾT (Cho phần Accordion đóng mở bên phải)
  // Feature Overview
  feature_overview: { 
    type: String, 
    default: "Engineered from a high-grade galvanised steel frame. Postureflex® Seating System for strength and support." 
  },
  // Shipping & Delivery
  shipping_info: { 
    type: String, 
    default: "Metro Delivery: From 8 weeks. Regional Delivery: From 12 weeks." 
  },
  // Warranty
  warranty_info: { 
    type: String, 
    default: "25 Year Steel Frame Warranty. 10 Year Foam Warranty." 
  },
  
  // 4. 3D MODEL SUPPORT (For AR/3D Visualization)
  model3D: {
    glb: { type: String }, // For web & Android AR (glTF Binary format)
    usdz: { type: String }, // For iOS AR (Universal Scene Description)
    thumbnail: { type: String } // 3D preview thumbnail image
  },
  
  countInStock: { type: Number, required: true, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);