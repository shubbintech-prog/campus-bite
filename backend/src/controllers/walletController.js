import { query } from "../config/db.js";

export const getWalletBalance = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [rows] = await query('SELECT * FROM wallets WHERE user_id = ?', [userId]);
        
        if (rows.length === 0) {
            // Create wallet if it doesn't exist
            const [result] = await query('INSERT INTO wallets (user_id, balance) VALUES (?, 0.00)', [userId]);
            const [newWallet] = await query('SELECT * FROM wallets WHERE id = ?', [result.insertId]);
            return res.json(newWallet[0]);
        }
        
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getWalletTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await query(`
            SELECT wt.* FROM wallet_transactions wt
            JOIN wallets w ON wt.wallet_id = w.id
            WHERE w.user_id = ?
            ORDER BY wt.created_at DESC
        `, [userId]);
        
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const depositFunds = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount, reference } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        // Start transaction
        await query('START TRANSACTION');
        
        let [walletRows] = await query('SELECT * FROM wallets WHERE user_id = ?', [userId]);
        if (walletRows.length === 0) {
            const [res] = await query('INSERT INTO wallets (user_id, balance) VALUES (?, 0)', [userId]);
            const [newWallet] = await query('SELECT * FROM wallets WHERE id = ?', [res.insertId]);
            walletRows = newWallet;
        }
        
        const walletId = walletRows[0].id;
        const newBalance = parseFloat(walletRows[0].balance) + parseFloat(amount);
        
        await query('UPDATE wallets SET balance = ? WHERE id = ?', [newBalance, walletId]);
        
        const [transResult] = await query(`
            INSERT INTO wallet_transactions (wallet_id, amount, type, reference, status)
            VALUES (?, ?, 'deposit', ?, 'completed')
        `, [walletId, amount, reference]);
        
        await query('COMMIT');
        
        const [transRows] = await query('SELECT * FROM wallet_transactions WHERE id = ?', [transResult.insertId]);
        res.json({ balance: newBalance, transaction: transRows[0] });
    } catch (error) {
        await query('ROLLBACK');
        res.status(500).json({ message: error.message });
    }
};

export const payForOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId, amount } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        await query('START TRANSACTION');
        
        const [walletRows] = await query('SELECT * FROM wallets WHERE user_id = ? FOR UPDATE', [userId]);
        
        if (walletRows.length === 0 || parseFloat(walletRows[0].balance) < parseFloat(amount)) {
            await query('ROLLBACK');
            return res.status(400).json({ message: "Insufficient balance" });
        }
        
        const walletId = walletRows[0].id;
        const newBalance = parseFloat(walletRows[0].balance) - parseFloat(amount);
        
        await query('UPDATE wallets SET balance = ? WHERE id = ?', [newBalance, walletId]);
        
        // Update order status if orderId provided
        if (orderId) {
            await query('UPDATE orders SET payment_status = ? WHERE id = ?', ['paid', orderId]);
        }
        
        const [transResult] = await query(`
            INSERT INTO wallet_transactions (wallet_id, amount, type, status)
            VALUES (?, ?, 'purchase', 'completed')
        `, [walletId, -amount]); // Negative for purchases
        
        await query('COMMIT');
        
        const [transRows] = await query('SELECT * FROM wallet_transactions WHERE id = ?', [transResult.insertId]);
        res.json({ balance: newBalance, transaction: transRows[0] });
    } catch (error) {
        await query('ROLLBACK');
        res.status(500).json({ message: error.message });
    }
};


