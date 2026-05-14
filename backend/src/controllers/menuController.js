import { query } from '../config/db.js';

// @desc    Get menu for a vendor
// @route   GET /api/vendors/:id/menu
export const getVendorMenu = async (req, res) => {
  try {
    const [rows] = await query(
      'SELECT mi.* FROM menu_items mi JOIN menus m ON mi.menu_id = m.id WHERE m.vendor_id = ?',
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add menu item
// @route   POST /api/menu/items
export const addMenuItem = async (req, res) => {
  const { menu_id, name, description, price, image_url, category } = req.body;
  try {
    const [result] = await query(
      'INSERT INTO menu_items (menu_id, name, description, price, image_url, category) VALUES (?, ?, ?, ?, ?, ?)',
      [menu_id, name, description, price, image_url, category]
    );
    const [newRows] = await query('SELECT * FROM menu_items WHERE id = ?', [result.insertId]);
    res.status(201).json(newRows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/items/:id
export const updateMenuItem = async (req, res) => {
  const { name, description, price, image_url, available, category } = req.body;
  try {
    await query(
      'UPDATE menu_items SET name = ?, description = ?, price = ?, image_url = ?, available = ?, category = ? WHERE id = ?',
      [name, description, price, image_url, available, category, req.params.id]
    );
    const [rows] = await query('SELECT * FROM menu_items WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/items/:id
export const deleteMenuItem = async (req, res) => {
  try {
    const [rows] = await query('SELECT * FROM menu_items WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      await query('DELETE FROM menu_items WHERE id = ?', [req.params.id]);
      res.json({ message: 'Menu item removed' });
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get all menu items
// @route   GET /api/menu/items
export const getAllMenuItems = async (req, res) => {
  try {
    const [rows] = await query('SELECT * FROM menu_items WHERE available = TRUE');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


