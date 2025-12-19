const jwt = require('jsonwebtoken');

/**
 * JWT Token Service
 * Handles JWT token generation and verification
 * Implements token strategy pattern for OCP compliance
 */
class JWTTokenService {
  
  constructor(secret = null, expiresIn = '30d') {
    this.secret = secret || process.env.JWT_SECRET || 'secret123';
    this.expiresIn = expiresIn;
  }

  /**
   * Generate a JWT token
   * @param {string} id - User ID
   * @returns {string} - JWT token
   */
  generate(id) {
    return jwt.sign({ id }, this.secret, { expiresIn: this.expiresIn });
  }

  /**
   * Verify a JWT token
   * @param {string} token - JWT token
   * @returns {Object} - Decoded token payload
   */
  verify(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Decode a JWT token without verification
   * @param {string} token - JWT token
   * @returns {Object} - Decoded token payload
   */
  decode(token) {
    return jwt.decode(token);
  }
}

module.exports = JWTTokenService;
