const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Thử kết nối với link trong file .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`Đã kết nối MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Lỗi kết nối: ${error.message}`);
    process.exit(1); // Thoát chương trình nếu lỗi
  }
};

module.exports = connectDB;