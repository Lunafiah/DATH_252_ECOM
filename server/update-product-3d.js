// Quick script to add 3D model data to the first product in MongoDB
// Run this in your backend server directory: node update-product-3d.js

require('dotenv').config();
const mongoose = require('mongoose');

// Use the MongoDB URI from .env file
const MONGODB_URI = process.env.MONGO_URI;

async function updateProduct() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Import the Product model
    const Product = require('./src/models/product.model.js');

    // Update the first product (Emerald Velvet Sofa)
    const result = await Product.findOneAndUpdate(
      { id: 1 }, // Find by id: 1
      {
        $set: {
          model3D: {
            glb: "/models/sofa.glb",
            usdz: "/models/sofa.usdz"  // Optional - for iOS AR
          }
        }
      },
      { new: true }
    );

    if (result) {
      console.log("Product updated successfully!");
      console.log("📦 Updated product:", result.title);
      console.log("🎨 3D Model data:", result.model3D);
    } else {
      console.log("Product not found");
    }

    await mongoose.connection.close();
    console.log("Connection closed");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

updateProduct();
