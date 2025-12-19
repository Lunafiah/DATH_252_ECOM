const container = require('../config/container');
const authService = container.getService('auth');

/**
 * Auth Controller
 * Handles HTTP requests for authentication
 */

// 1. Register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userInfo = await authService.register(name, email, password);
    
    // 201 Created
    res.status(201).json(userInfo);
  } catch (error) {
    // Return 400 Bad Request for validation errors
    res.status(400).json({ message: error.message });
  }
};

// 2. Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userInfo = await authService.login(email, password);
    
    res.json(userInfo);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};