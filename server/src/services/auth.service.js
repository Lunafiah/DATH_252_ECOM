/**
 * Authentication Service
 * Handles user registration and login
 * Refactored to use dependency injection (DIP compliance)
 */
class AuthService {
  
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  /**
   * Register a new user
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>}
   */
  async register(name, email, password) {
    // Check if email already exists
    const userExists = await this.userRepository.findByEmail(email);
    if (userExists) {
      throw new Error('Email này đã được sử dụng');
    }

    // Create user
    const user = await this.userRepository.create({ name, email, password });

    if (user) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: this.tokenService.generate(user._id)
      };
    } else {
      throw new Error('Dữ liệu người dùng không hợp lệ');
    }
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>}
   */
  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);

    // Check user and password (matchPassword method is in User Model)
    if (user && (await user.matchPassword(password))) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: this.tokenService.generate(user._id)
      };
    } else {
      throw new Error('Sai email hoặc mật khẩu');
    }
  }
}

module.exports = AuthService;