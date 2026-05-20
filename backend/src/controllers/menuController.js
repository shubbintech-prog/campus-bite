import MenuItem from '../models/MenuItem.js';
import Menu from '../models/Menu.js';
import Vendor from '../models/Vendor.js';
import VendorProfile from '../models/VendorProfile.js';
import User from '../models/User.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Helper to optimize and store uploaded images
const processImage = async (file) => {
  if (!file) return null;
  const fileName = `food-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`;
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const destPath = path.join(uploadDir, fileName);
  
  await sharp(file.path)
    .resize(600, 400, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toFile(destPath);
    
  // Clean up original temporary file
  try {
    fs.unlinkSync(file.path);
  } catch (err) {
    console.error('Failed to delete temp file:', err);
  }
  
  return `/uploads/${fileName}`;
};

// Helper to resolve or create a vendor storefront and associated menu
const resolveVendorMenu = async (req) => {
  if (!req.user) {
    throw new Error('Authentication required');
  }

  // Check if a vendor storefront already exists for this email
  let vendor = await Vendor.findOne({ email: req.user.email });
  
  if (!vendor) {
    // Attempt to bridge onboarding details from VendorProfile
    const profile = await VendorProfile.findOne({ user: req.user.id });
    vendor = await Vendor.create({
      vendor_name: profile ? profile.business_name : `${req.user.name}'s Kitchen`,
      owner_name: req.user.name,
      email: req.user.email,
      phone: req.user.phone || (profile ? profile.phone : ''),
      location: profile ? profile.school_location : 'Main Campus',
      location_landmark: '',
      status: 'active',
    });
  }

  // Check if a Menu exists for this storefront, or auto-create one
  let menu = await Menu.findOne({ vendor: vendor._id });
  if (!menu) {
    menu = await Menu.create({
      vendor: vendor._id,
      menu_name: 'Daily Menu',
    });
  }

  return menu;
};

// @desc    Get menu for a vendor
// @route   GET /api/vendors/:id/menu
export const getVendorMenu = async (req, res) => {
  try {
    let menu = await Menu.findOne({ vendor: req.params.id });
    if (!menu) {
      // Fallback: check if the id corresponds to a User ID
      const user = await User.findById(req.params.id);
      if (user) {
        const vendor = await Vendor.findOne({ email: user.email });
        if (vendor) {
          menu = await Menu.findOne({ vendor: vendor._id });
        }
      }
    }
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
  try {
    // Resolve menu dynamically from active session if possible
    let activeMenu = null;
    try {
      activeMenu = await resolveVendorMenu(req);
    } catch (err) {
      // Fallback to body-supplied menu_id if no active session
      if (req.body.menu_id) {
        activeMenu = { _id: req.body.menu_id };
      }
    }

    if (!activeMenu) {
      return res.status(400).json({ message: 'Unable to resolve merchant menu storefront.' });
    }

    // Process image file if uploaded
    let finalImageUrl = req.body.image_url || '';
    if (req.file) {
      const uploadedPath = await processImage(req.file);
      if (uploadedPath) {
        finalImageUrl = uploadedPath;
      }
    }

    const { name, description, price, category } = req.body;
    
    const item = await MenuItem.create({
      menu: activeMenu._id,
      name,
      description,
      price: parseFloat(price),
      image_url: finalImageUrl,
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
  try {
    const existingItem = await MenuItem.findById(req.params.id);
    if (!existingItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    let finalImageUrl = req.body.image_url !== undefined ? req.body.image_url : existingItem.image_url;
    
    if (req.file) {
      const uploadedPath = await processImage(req.file);
      if (uploadedPath) {
        // Housekeeping: delete old image if it was a local upload
        if (existingItem.image_url && existingItem.image_url.startsWith('/uploads/')) {
          const oldPath = path.join(process.cwd(), 'public', existingItem.image_url);
          try {
            if (fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
            }
          } catch (err) {
            console.error('Failed to clean up old image:', err);
          }
        }
        finalImageUrl = uploadedPath;
      }
    }

    const { name, description, price, available, category } = req.body;
    
    const updateData = {
      name: name !== undefined ? name : existingItem.name,
      description: description !== undefined ? description : existingItem.description,
      price: price !== undefined ? parseFloat(price) : existingItem.price,
      image_url: finalImageUrl,
      available: available !== undefined ? (available === 'true' || available === true) : existingItem.available,
      category: category !== undefined ? category : existingItem.category,
    };

    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/items/:id
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Clean up associated local file
    if (item.image_url && item.image_url.startsWith('/uploads/')) {
      const imgPath = path.join(process.cwd(), 'public', item.image_url);
      try {
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      } catch (err) {
        console.error('Failed to delete image file during menu item removal:', err);
      }
    }

    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item removed' });
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
