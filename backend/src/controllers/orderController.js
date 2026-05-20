import Order from '../models/Order.js';
import Vendor from '../models/Vendor.js';
import User from '../models/User.js';
import VendorProfile from '../models/VendorProfile.js';
import Notification from '../models/Notification.js';
import { emitToRoom } from '../config/socket.js';

// @desc    Create new order
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  const { vendor_id, items, total_price, total_amount } = req.body;
  const user_id = req.user.id;

  try {
    const order = await Order.create({
      user: user_id,
      vendor: vendor_id,
      total_price: total_price || total_amount,
      items: items.map((i) => ({
        menu_item_id: i.menu_item_id,
        quantity: i.quantity,
        price: i.price,
      })),
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin, Vendor, or Student)
// @route   GET /api/orders
export const getOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === 'admin') {
      orders = await Order.find()
        .populate('vendor', 'vendor_name')
        .sort({ created_at: -1 });
    } else if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ email: (await User.findById(req.user.id)).email });
      orders = await Order.find({ vendor: vendor?._id })
        .populate('user', 'name')
        .sort({ created_at: -1 });

      // Map student_name alias for frontend compatibility
      orders = orders.map((o) => {
        const plain = o.toJSON();
        plain.student_name = plain.user?.name;
        return plain;
      });
    } else {
      orders = await Order.find({ user: req.user.id })
        .populate('vendor', 'vendor_name')
        .sort({ created_at: -1 });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.menu_item_id',
      'name'
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { order_status: status },
      { new: true }
    );

    if (order) {
      // Create notification
      await Notification.create({
        user: order.user,
        title: 'Order Update',
        message: `Your order #${order._id} is now ${status}!`,
      });

      // Emit socket event
      emitToRoom(`user_${order.user}`, 'order_update', order);

      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders for active vendor storefront
// @route   GET /api/orders/vendor
export const getVendorOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Look up vendor storefront by email
    let vendor = await Vendor.findOne({ email: user.email });

    // Bridge vendor storefront dynamically if they registered but their Vendor model wasn't created yet
    if (!vendor) {
      const profile = await VendorProfile.findOne({ user: user._id });
      if (profile) {
        vendor = await Vendor.create({
          vendor_name: profile.business_name,
          owner_name: user.name,
          email: user.email,
          phone: user.phone || '',
          location: profile.school_location,
          location_landmark: '',
          status: 'active',
        });
      }
    }

    if (!vendor) {
      return res.json([]);
    }

    let orders = await Order.find({ vendor: vendor._id })
      .populate('user', 'name')
      .sort({ created_at: -1 });

    // Map student_name alias for frontend compatibility
    orders = orders.map((o) => {
      const plain = o.toJSON();
      plain.student_name = plain.user?.name;
      return plain;
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
