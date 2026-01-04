const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../../public/models');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Sanitize filename: lowercase, replace spaces and special chars with underscore
    const sanitized = file.originalname
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9._-]/g, '_');
    cb(null, sanitized);
  }
});
// File filter: only accept .glb and .gltf files
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.glb', '.gltf'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .glb and .gltf files are allowed'), false);
  }
};
// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  }
});
// Upload endpoint
router.post('/glb', upload.single('glbFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Return the public URL path
    const filePath = `/models/${req.file.filename}`;
    
    console.log('GLB file uploaded:', filePath);
    
    res.json({
      success: true,
      path: filePath,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});
// Error handling middleware
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large (max 50MB)' });
    }
  }
  res.status(400).json({ message: error.message });
});
module.exports = router;