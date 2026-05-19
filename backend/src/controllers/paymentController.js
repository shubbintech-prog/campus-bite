import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import { initializePayment, verifyPayment } from '../services/paystackService.js';

// @desc    Initialize payment (Simulated Gateway)
// @route   POST /api/payments/initialize
export const initPayment = async (req, res) => {
  const { order_id, amount } = req.body;
  const email = req.user.email;

  try {
    // Generate a unique simulated transaction reference
    const reference = 'sim_' + Math.random().toString(36).substring(2, 15);
    
    // Create record in payments table
    await Payment.create({
      order: order_id,
      amount,
      transaction_reference: reference,
      payment_status: 'pending',
    });

    // Provide a beautiful mock gateway URL pointing to our frontend simulated gateway page!
    const mockAuthUrl = `/simulate-payment?orderId=${order_id}&amount=${amount}&reference=${reference}`;

    res.json({
      authorization_url: mockAuthUrl,
      reference: reference
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Simulate payment success callback from the mock gateway
// @route   POST /api/payments/simulate-success
export const simulatePaymentSuccess = async (req, res) => {
  const { order_id, reference } = req.body;

  try {
    // Update payment status
    await Payment.findOneAndUpdate(
      { transaction_reference: reference },
      { payment_status: 'paid' }
    );

    // Update order status
    await Order.findByIdAndUpdate(order_id, { payment_status: 'paid' });

    res.json({ success: true, message: 'Simulated payment succeeded!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Paystack Webhook (Kept for compatibility)
// @route   POST /api/payments/webhook
export const handleWebhook = async (req, res) => {
  const event = req.body;

  try {
    if (event.event === 'charge.success') {
      const { reference, metadata } = event.data;
      const order_id = metadata.order_id;

      await Payment.findOneAndUpdate(
        { transaction_reference: reference },
        { payment_status: 'paid' }
      );

      await Order.findByIdAndUpdate(order_id, { payment_status: 'paid' });
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
};
