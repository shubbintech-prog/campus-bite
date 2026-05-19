import Vendor from '../models/Vendor.js';
import Order from '../models/Order.js';

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
    const vendor = await Vendor.findById(req.params.id);
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
  const { vendor_name, owner_name, phone, location, status } = req.body;
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { vendor_name, owner_name, phone, location, status },
      { new: true }
    );
    if (vendor) {
      res.json(vendor);
    } else {
      res.status(404).json({ message: 'Vendor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
