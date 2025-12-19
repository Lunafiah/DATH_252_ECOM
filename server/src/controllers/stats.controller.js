const container = require('../config/container');
const statsService = container.getService('stats');

exports.getDashboardStats = async (req, res) => {
  try {
    // Controller calls Service to get dashboard stats
    const stats = await statsService.getDashboardStats();
    
    // Sau đó trả kết quả về cho Client
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};