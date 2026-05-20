import Vendor from '../models/Vendor.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Helper to optimize and store uploaded restaurant storefront images
const processStorefrontImage = async (file) => {
  if (!file) return null;
  const fileName = `vendor-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`;
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const destPath = path.join(uploadDir, fileName);
  
  await sharp(file.path)
    .resize(800, 500, { fit: 'cover' })
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

// @desc    Get all vendors
// @route   GET /api/vendors
export const getVendors = async (req, res) => {
  const { search } = req.query;
  try {
    const filter = { status: 'active' };
    if (search) {
      filter.$or = [
        { vendor_name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const vendors = await Vendor.find(filter).lean();

    for (const vendor of vendors) {
      const pendingCount = await Order.countDocuments({
        vendor: vendor._id,
        order_status: { $in: ['pending', 'preparing'] },
      });
      vendor.wait_time_estimate = 5 + pendingCount * 5;
      vendor.is_busy = pendingCount > 5;
      vendor.id = vendor._id;
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
    let vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      // Fallback: check if the id corresponds to a User ID
      const user = await User.findById(req.params.id);
      if (user) {
        vendor = await Vendor.findOne({ email: user.email });
      }
    }
    if (vendor) {
      res.json(vendor);
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
    const vendor = await Vendor.create({ vendor_name, owner_name, email, phone, location });
    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update vendor
// @route   PUT /api/vendors/:id
export const updateVendor = async (req, res) => {
  const { vendor_name, owner_name, phone, location, location_landmark, status } = req.body;
  try {
    let existingVendor = await Vendor.findById(req.params.id);
    if (!existingVendor) {
      // Fallback: check if the id corresponds to a User ID
      const user = await User.findById(req.params.id);
      if (user) {
        existingVendor = await Vendor.findOne({ email: user.email });
        if (existingVendor) {
          req.params.id = existingVendor._id;
        }
      }
    }

    if (!existingVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    let finalImageUrl = req.body.image_url !== undefined ? req.body.image_url : existingVendor.image_url;
    
    if (req.file) {
      const uploadedPath = await processStorefrontImage(req.file);
      if (uploadedPath) {
        // Clean up old storefront image if it exists and was a local upload
        if (existingVendor.image_url && existingVendor.image_url.startsWith('/uploads/')) {
          const oldPath = path.join(process.cwd(), 'public', existingVendor.image_url);
          try {
            if (fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
            }
          } catch (err) {
            console.error('Failed to clean up old storefront image:', err);
          }
        }
        finalImageUrl = uploadedPath;
      }
    }

    const updateFields = {
      vendor_name: vendor_name !== undefined ? vendor_name : existingVendor.vendor_name,
      owner_name: owner_name !== undefined ? owner_name : existingVendor.owner_name,
      phone: phone !== undefined ? phone : existingVendor.phone,
      location: location !== undefined ? location : existingVendor.location,
      location_landmark: location_landmark !== undefined ? location_landmark : existingVendor.location_landmark,
      status: status !== undefined ? status : existingVendor.status,
      image_url: finalImageUrl,
    };

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

