const container = require('../config/container');
const userService = container.getService('user');

// 1. Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; // From protect middleware
    const { name, password } = req.body;

    const updatedUser = await userService.updateProfile(userId, { name, password });

    // Return updated user data with existing token
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      addresses: updatedUser.addresses,
      token: req.headers.authorization.split(' ')[1] 
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// 2. Add address
exports.addAddress = async (req, res) => {
  try {
    const addresses = await userService.addAddress(req.user._id, req.body);
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const addresses = await userService.deleteAddress(req.user._id, req.params.id);
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
