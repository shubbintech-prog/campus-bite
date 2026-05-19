import Wallet from '../models/Wallet.js';
import WalletTransaction from '../models/WalletTransaction.js';
import Order from '../models/Order.js';

export const getWalletBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      wallet = await Wallet.create({ user: userId, balance: 0.0 });
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWalletTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return res.json([]);

    const transactions = await WalletTransaction.find({ wallet: wallet._id }).sort({
      created_at: -1,
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const depositFunds = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, reference } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const wallet = await Wallet.findOneAndUpdate(
      { user: userId },
      { $inc: { balance: parseFloat(amount) } },
      { new: true, upsert: true }
    );

    const transaction = await WalletTransaction.create({
      wallet: wallet._id,
      amount,
      type: 'deposit',
      reference,
      status: 'completed',
    });

    res.json({ balance: wallet.balance, transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const payForOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Atomic update checking that balance is at least equal to amount
    const wallet = await Wallet.findOneAndUpdate(
      { user: userId, balance: { $gte: parseFloat(amount) } },
      { $inc: { balance: -parseFloat(amount) } },
      { new: true }
    );

    if (!wallet) {
      return res.status(400).json({ message: 'Insufficient balance or wallet not found' });
    }

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { payment_status: 'paid' });
    }

    const transaction = await WalletTransaction.create({
      wallet: wallet._id,
      amount: -amount,
      type: 'purchase',
      status: 'completed',
    });

    res.json({ balance: wallet.balance, transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
