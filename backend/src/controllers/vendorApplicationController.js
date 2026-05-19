import VendorApplication from '../models/VendorApplication.js';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import Notification from '../models/Notification.js';

// @desc    Apply to become a vendor
// @route   POST /api/vendor-applications
// @access  Private (Student only)
export const applyAsVendor = async (req, res) => {
  const { business_name, phone_number, food_category, description, location_landmark } = req.body;
  const user_id = req.user.id;

  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can apply to become vendors' });
    }

    const existing = await VendorApplication.findOne({
      user: user_id,
      status: { $in: ['pending', 'approved'] },
    });

    if (existing) {
      return res.status(400).json({
        message:
          existing.status === 'approved'
            ? 'You are already an approved vendor'
            : 'You already have a pending application',
      });
    }

    const application = await VendorApplication.create({
      user: user_id,
      business_name,
      phone_number,
      food_category,
      description,
      location_landmark,
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      id: application._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all vendor applications
// @route   GET /api/vendor-applications
// @access  Private (Admin only)
export const getApplications = async (req, res) => {
  try {
    const applications = await VendorApplication.find()
      .populate('user', 'name email')
      .sort({ created_at: -1 });

    const result = applications.map((app) => {
      const plain = app.toJSON();
      plain.applicant_name = plain.user?.name;
      plain.applicant_email = plain.user?.email;
      return plain;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Review a vendor application
// @route   PUT /api/vendor-applications/:id/review
// @access  Private (Admin only)
export const reviewApplication = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const application = await VendorApplication.findById(id).populate('user', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ message: 'Application already reviewed' });
    }

    application.status = status;
    await application.save();

    if (status === 'approved') {
      // Update user role to vendor
      await User.findByIdAndUpdate(application.user._id, { role: 'vendor' });

      // Check if vendor already exists
      const existingVendor = await Vendor.findOne({ email: application.user.email });

      if (!existingVendor) {
        await Vendor.create({
          vendor_name: application.business_name,
          owner_name: application.user.name || application.business_name,
          email: application.user.email,
          phone: application.phone_number,
          location: 'Main Campus',
          location_landmark: application.location_landmark || '',
          status: 'active',
        });
      } else {
        existingVendor.status = 'active';
        existingVendor.vendor_name = application.business_name;
        await existingVendor.save();
      }
    }

    // Send notification
    await Notification.create({
      user: application.user._id,
      title: `Vendor Application ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message:
        status === 'approved'
          ? 'Congratulations! Your application to become a vendor has been approved. You can now access the vendor dashboard.'
          : 'We regret to inform you that your application to become a vendor has been rejected.',
    });

    res.json({ message: `Application ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
