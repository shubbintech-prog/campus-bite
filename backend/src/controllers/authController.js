import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import VendorProfile from '../models/VendorProfile.js';
import Wallet from '../models/Wallet.js';
import { generateToken } from '../middleware/authMiddleware.js';

// Helper to construct slug
const slugify = (text) => text.toString().toLowerCase().trim()
  .replace(/\s+/g, '-')
  .replace(/[^\w\-]+/g, '')
  .replace(/\-\-+/g, '-');

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  const { 
    name, 
    email, 
    phone, 
    password, 
    role,
    restaurantName,
    restaurantAddress,
    restaurantDescription,
    categories
  } = req.body;
  const normalizedEmail = email ? email.toLowerCase().trim() : '';

  try {
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Dynamic initial role configuration based on choice
    const initialRole = role === 'vendor' ? 'vendor' : 'student';

    const user = await User.create({
      name,
      email: normalizedEmail,
      phone,
      password_hash: passwordHash,
      roles: [initialRole],
      active_role: initialRole,
      onboarding_completed: true, // Automatically completed because they specify details at registration
      seller_onboarding_status: initialRole === 'vendor' ? 'approved' : 'none',
    });

    // Auto-create wallet for student buyers
    if (initialRole === 'student') {
      await Wallet.create({ user: user._id, balance: 5000 });
    }

    // Auto-create VendorProfile for sellers
    if (initialRole === 'vendor') {
      const businessName = restaurantName || `${name}'s Kitchen`;
      const businessSlug = slugify(businessName) + '-' + Math.floor(1000 + Math.random() * 9000);
      
      const parsedCategories = Array.isArray(categories) 
        ? categories 
        : categories 
          ? categories.split(',').map(c => c.trim()) 
          : ['Nigerian', 'Fast Food'];

      await VendorProfile.create({
        user: user._id,
        business_name: businessName,
        business_slug: businessSlug,
        logo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
        categories: parsedCategories,
        school_location: restaurantAddress || 'Main Campus',
        operating_hours: { open: '08:00', close: '20:00' },
        description: restaurantDescription || '',
        verification_status: 'approved',
      });
    }

    res.status(201).json({
      id: user._id,
      full_name: user.name,
      email: user.email,
      role: user.active_role, // backwards compatibility
      roles: user.roles,
      active_role: user.active_role,
      onboarding_completed: user.onboarding_completed,
      seller_onboarding_status: user.seller_onboarding_status,
      token: generateToken(user._id, user.active_role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email ? email.toLowerCase().trim() : '';

  try {
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      res.json({
        id: user._id,
        full_name: user.name,
        email: user.email,
        role: user.active_role, // backwards compatibility
        roles: user.roles,
        active_role: user.active_role,
        onboarding_completed: user.onboarding_completed,
        seller_onboarding_status: user.seller_onboarding_status,
        token: generateToken(user._id, user.active_role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      res.json({
        id: user._id,
        full_name: user.name,
        email: user.email,
        role: user.active_role, // backwards compatibility
        roles: user.roles,
        active_role: user.active_role,
        onboarding_completed: user.onboarding_completed,
        seller_onboarding_status: user.seller_onboarding_status,
        phone: user.phone,
        bio: user.bio || '',
        default_address: user.default_address || '',
        saved_addresses: user.saved_addresses || [],
        image_url: user.image_url || '',
        created_at: user.created_at,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Switch active role
// @route   POST /api/auth/switch-role
export const switchRole = async (req, res) => {
  const { role } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.roles.includes(role)) {
      return res.status(400).json({ message: `Role ${role} is not assigned to this account` });
    }

    user.active_role = role;
    await user.save();

    res.json({
      active_role: user.active_role,
      roles: user.roles,
      token: generateToken(user._id, user.active_role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upgrade to Seller / Vendor Onboarding Wizard
// @route   POST /api/auth/upgrade-seller
export const upgradeSeller = async (req, res) => {
  const { businessName, logo, categories, schoolLocation, operatingHours, phone } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Dynamic upgrade to hybrid mode
    if (!user.roles.includes('vendor')) {
      user.roles.push('vendor');
    }
    user.active_role = 'vendor';
    user.seller_onboarding_status = 'approved'; // Instant approval for smooth onboarding demonstration
    user.onboarding_completed = true;
    if (phone) user.phone = phone;
    await user.save();

    // Create unique business slug
    const businessSlug = slugify(businessName) + '-' + Math.floor(1000 + Math.random() * 9000);

    // Save VendorProfile details to persistent store
    const vendorProfile = await VendorProfile.create({
      user: user._id,
      business_name: businessName,
      business_slug: businessSlug,
      logo: logo || '',
      categories: categories || [],
      school_location: schoolLocation || 'Main Campus',
      operating_hours: operatingHours || { open: '08:00', close: '20:00' },
      verification_status: 'approved',
    });

    res.status(201).json({
      message: 'Onboarding completed successfully!',
      user: {
        id: user._id,
        full_name: user.name,
        email: user.email,
        roles: user.roles,
        active_role: user.active_role,
        onboarding_completed: user.onboarding_completed,
        seller_onboarding_status: user.seller_onboarding_status,
      },
      vendorProfile,
      token: generateToken(user._id, user.active_role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  const { name, phone, bio, default_address, saved_addresses, image_url } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (default_address !== undefined) user.default_address = default_address;
    if (saved_addresses !== undefined) user.saved_addresses = saved_addresses;
    if (image_url !== undefined) user.image_url = image_url;

    await user.save();

    res.json({
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        full_name: user.name,
        email: user.email,
        role: user.active_role,
        roles: user.roles,
        active_role: user.active_role,
        onboarding_completed: user.onboarding_completed,
        seller_onboarding_status: user.seller_onboarding_status,
        phone: user.phone,
        bio: user.bio || '',
        default_address: user.default_address || '',
        saved_addresses: user.saved_addresses || [],
        image_url: user.image_url || '',
        created_at: user.created_at,
      },
      token: generateToken(user._id, user.active_role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
