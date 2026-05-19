import MenuItem from '../models/MenuItem.js';
import Menu from '../models/Menu.js';

// @desc    Get menu for a vendor
// @route   GET /api/vendors/:id/menu
export const getVendorMenu = async (req, res) => {
  try {
    const menu = await Menu.findOne({ vendor: req.params.id });
    if (!menu) return res.json([]);

    const items = await MenuItem.find({ menu: menu._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add menu item
// @route   POST /api/menu/items
export const addMenuItem = async (req, res) => {
  const { menu_id, name, description, price, image_url, category } = req.body;
  try {
    const item = await MenuItem.create({
      menu: menu_id,
      name,
      description,
      price,
      image_url,
      category,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/items/:id
export const updateMenuItem = async (req, res) => {
  const { name, description, price, image_url, available, category } = req.body;
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image_url, available, category },
      { new: true }
    );
    if (item) {
      res.json(item);
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
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (item) {
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
    const items = await MenuItem.find({ available: true });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
