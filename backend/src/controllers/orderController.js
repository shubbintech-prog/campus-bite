import { query } from '../config/db.js';
import { emitToRoom } from '../config/socket.js';

// @desc    Create new order
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  const { vendor_id, items, total_price } = req.body;
  const user_id = req.user.id;

  try {
    // Start transaction
    await query('START TRANSACTION');

    const [orderResult] = await query(
      'INSERT INTO orders (user_id, vendor_id, total_price) VALUES (?, ?, ?)',
      [user_id, vendor_id, total_price]
    );
    const orderId = orderResult.insertId;

    for (const item of items) {
      await query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.menu_item_id, item.quantity, item.price]
      );
    }

    await query('COMMIT');
    
    const [newOrderRows] = await query('SELECT * FROM orders WHERE id = ?', [orderId]);
    res.status(201).json(newOrderRows[0]);
  } catch (error) {
    await query('ROLLBACK');
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin or User)
// @route   GET /api/orders
export const getOrders = async (req, res) => {
  try {
    let rows;
    if (req.user.role === 'admin') {
      const [allRows] = await query(`
        SELECT o.*, v.vendor_name 
        FROM orders o 
        JOIN vendors v ON o.vendor_id = v.id 
        ORDER BY o.created_at DESC
      `);
      rows = allRows;
    } else if (req.user.role === 'vendor') {
      const [vendorRows] = await query('SELECT id FROM vendors WHERE email = (SELECT email FROM users WHERE id = ?)', [req.user.id]);
      const vendorId = vendorRows[0]?.id;
      const [vOrderRows] = await query(`
        SELECT o.*, u.name as student_name 
        FROM orders o 
        JOIN users u ON o.user_id = u.id 
        WHERE o.vendor_id = ? 
        ORDER BY o.created_at DESC
      `, [vendorId]);
      rows = vOrderRows;
    } else {
      const [uOrderRows] = await query(`
        SELECT o.*, v.vendor_name 
        FROM orders o 
        JOIN vendors v ON o.vendor_id = v.id 
        WHERE o.user_id = ? 
        ORDER BY o.created_at DESC
      `, [req.user.id]);
      rows = uOrderRows;
    }
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const [orderRows] = await query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    const order = orderRows[0];

    if (order) {
      const [itemsRows] = await query(
        'SELECT oi.*, mi.name FROM order_items oi JOIN menu_items mi ON oi.menu_item_id = mi.id WHERE oi.order_id = ?',
        [order.id]
      );
      order.items = itemsRows;
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
    await query(
      'UPDATE orders SET order_status = ? WHERE id = ?',
      [status, req.params.id]
    );
    const [rows] = await query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    
    if (rows.length > 0) {
      const order = rows[0];
      
      // Create notification
      await query(
        'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
        [order.user_id, 'Order Update', `Your order #${order.id} is now ${status}!`]
      );

      // Emit socket event to the user's room
      emitToRoom(`user_${order.user_id}`, 'order_update', order);
      
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


