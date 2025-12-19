const container = require('../config/container');
const orderService = container.getService('order');

// 1. Tạo đơn hàng
exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống' });
    }

    // Gọi Service để xử lý
    const createdOrder = await orderService.createOrder(orderData);
    
    res.status(201).json(createdOrder);
  } catch (error) {
    // Nếu Service báo lỗi (ví dụ hết hàng), trả về lỗi 400
    res.status(400).json({ message: error.message });
  }
};

// 2. Lấy danh sách đơn hàng của tôi
exports.getMyOrders = async (req, res) => {
  try {
    const email = req.query.email; // Hoặc lấy từ req.user.email nếu muốn bảo mật hơn
    const orders = await orderService.getOrdersByUserEmail(email);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Admin lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Admin cập nhật trạng thái
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedOrder = await orderService.updateStatus(id, status);
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 5. Xem chi tiết đơn hàng (Kèm bảo mật)
exports.getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);

    // Logic kiểm tra quyền xem vẫn nên để ở Controller (hoặc Middleware)
    const isOwner = order.customer.email === req.user.email;
    const isAdmin = req.user.role === 'admin';

    if (isAdmin || isOwner) {
      res.json(order);
    } else {
      res.status(403).json({ message: 'Bạn không có quyền xem đơn hàng này' });
    }
  } catch (error) {
    // Nếu lỗi là do không tìm thấy đơn hoặc ID sai format
    res.status(404).json({ message: error.message });
  }
};