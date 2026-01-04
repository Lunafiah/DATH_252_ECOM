// CRITICAL: Load environment variables FIRST before any other imports
// This ensures JWT_SECRET is available when the container is initialized
require('dotenv').config();

// Debug: Verify JWT_SECRET is loaded
console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'YES' : 'NO');
if (!process.env.JWT_SECRET) {
  console.error('WARNING: JWT_SECRET not found in .env file!');
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/index'); // Import file gộp routes

connectDB();

const app = express();
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images/GLB files
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Sử dụng tất cả routes với tiền tố /api
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
