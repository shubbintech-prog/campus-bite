import { initializePayment, verifyPayment } from '../services/paystackService.js';
import { query } from '../config/db.js';

// @desc    Initialize payment
// @route   POST /api/payments/initialize
export const initPayment = async (req, res) => {
  const { order_id, amount } = req.body;
  const email = req.user.email;

  try {
    const data = await initializePayment(email, amount, order_id);
    
    // Create record in payments table
    await query(
      'INSERT INTO payments (order_id, amount, transaction_reference, payment_status) VALUES (?, ?, ?, ?)',
      [order_id, amount, data.data.reference, 'pending']
    );

    res.json(data.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Paystack Webhook
// @route   POST /api/payments/webhook
export const handleWebhook = async (req, res) => {
  // Paystack sends a POST request to this endpoint
  const event = req.body;

  try {
    if (event.event === 'charge.success') {
      const { reference, metadata } = event.data;
      const order_id = metadata.order_id;

      // Update payment status
      await query(
        'UPDATE payments SET payment_status = ? WHERE transaction_reference = ?',
        ['paid', reference]
      );

      // Update order status
      await query(
        'UPDATE orders SET payment_status = ? WHERE id = ?',
        ['paid', order_id]
      );
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
};


