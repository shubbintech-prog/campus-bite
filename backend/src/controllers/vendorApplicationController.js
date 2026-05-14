import { query } from '../config/db.js';

// @desc    Apply to become a vendor
// @route   POST /api/vendor-applications
// @access  Private (Student only)
export const applyAsVendor = async (req, res) => {
  const { business_name, phone_number, food_category, description, location_landmark } = req.body;
  const user_id = req.user.id;

  try {
    // Check if user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can apply to become vendors' });
    }

    // Check if user already has a pending or approved application
    const [existing] = await query(
      'SELECT id, status FROM vendor_applications WHERE user_id = ? AND status IN ("pending", "approved")',
      [user_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        message: existing[0].status === 'approved' 
          ? 'You are already an approved vendor' 
          : 'You already have a pending application' 
      });
    }

    const [result] = await query(
      'INSERT INTO vendor_applications (user_id, business_name, phone_number, food_category, description, location_landmark) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, business_name, phone_number, food_category, description, location_landmark]
    );

    res.status(201).json({
      message: 'Application submitted successfully',
      id: result.insertId
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
    const [rows] = await query(`
      SELECT va.*, u.name as applicant_name, u.email as applicant_email 
      FROM vendor_applications va 
      JOIN users u ON va.user_id = u.id 
      ORDER BY va.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Review a vendor application
// @route   PUT /api/vendor-applications/:id/review
// @access  Private (Admin only)
export const reviewApplication = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // approved or rejected

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const [apps] = await query(`
      SELECT va.*, u.email as user_email 
      FROM vendor_applications va
      JOIN users u ON va.user_id = u.id
      WHERE va.id = ?
    `, [id]);
    const application = apps[0];

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ message: 'Application already reviewed' });
    }

    // Update application status
    await query('UPDATE vendor_applications SET status = ? WHERE id = ?', [status, id]);

    if (status === 'approved') {
      // 1. Update user role
      await query('UPDATE users SET role = "vendor" WHERE id = ?', [application.user_id]);

      // 2. Check if vendor already exists with this email
      const [existingVendor] = await query('SELECT id FROM vendors WHERE email = ?', [application.user_email]);
      
      if (existingVendor.length === 0) {
        // Create vendor record
        await query(
          'INSERT INTO vendors (vendor_name, owner_name, email, phone, location, location_landmark, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            application.business_name,
            application.applicant_name || application.business_name,
            application.user_email,
            application.phone_number,
            'Main Campus',
            application.location_landmark || '',
            'active'
          ]
        );
      } else {
        // Update existing vendor record status
        await query('UPDATE vendors SET status = "active", vendor_name = ? WHERE id = ?', [application.business_name, existingVendor[0].id]);
      }
    }

    // Send notification
    await query(
      'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
      [
        application.user_id,
        `Vendor Application ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        status === 'approved' 
          ? 'Congratulations! Your application to become a vendor has been approved. You can now access the vendor dashboard.'
          : 'We regret to inform you that your application to become a vendor has been rejected.'
      ]
    );

    res.json({ message: `Application ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
