import { query } from '../config/db.js';

// @desc    Get all vendors
// @route   GET /api/vendors
export const getVendors = async (req, res) => {
  const { search } = req.query;
  try {
    let sql = 'SELECT * FROM vendors WHERE status = ?';
    let params = ['active'];

    if (search) {
      sql += ' AND (vendor_name LIKE ? OR location LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [rows] = await query(sql, params);
    const vendors = rows;

    for (const vendor of vendors) {
      const [pendingResult] = await query(
        "SELECT COUNT(*) as count FROM orders WHERE vendor_id = ? AND order_status IN ('pending', 'preparing')",
        [vendor.id]
      );
      const pendingCount = parseInt(pendingResult[0].count || 0);
      vendor.wait_time_estimate = 5 + (pendingCount * 5);
      vendor.is_busy = pendingCount > 5;
    }

    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single vendor
// @route   GET /api/vendors/:id
export const getVendorById = async (req, res) => {
  try {
    const [rows] = await query('SELECT * FROM vendors WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Vendor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a vendor
// @route   POST /api/vendors
export const createVendor = async (req, res) => {
  const { vendor_name, owner_name, email, phone, location } = req.body;
  try {
    const [result] = await query(
      'INSERT INTO vendors (vendor_name, owner_name, email, phone, location) VALUES (?, ?, ?, ?, ?)',
      [vendor_name, owner_name, email, phone, location]
    );
    const [newVendor] = await query('SELECT * FROM vendors WHERE id = ?', [result.insertId]);
    res.status(201).json(newVendor[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update vendor
// @route   PUT /api/vendors/:id
export const updateVendor = async (req, res) => {
  const { vendor_name, owner_name, phone, location, status } = req.body;
  try {
    await query(
      'UPDATE vendors SET vendor_name = ?, owner_name = ?, phone = ?, location = ?, status = ? WHERE id = ?',
      [vendor_name, owner_name, phone, location, status, req.params.id]
    );
    const [updatedVendor] = await query('SELECT * FROM vendors WHERE id = ?', [req.params.id]);
    if (updatedVendor.length > 0) {
      res.json(updatedVendor[0]);
    } else {
      res.status(404).json({ message: 'Vendor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




