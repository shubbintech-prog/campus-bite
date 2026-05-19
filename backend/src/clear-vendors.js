import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

import User from './models/User.js';
import Vendor from './models/Vendor.js';
import Menu from './models/Menu.js';
import MenuItem from './models/MenuItem.js';

async function clearVendors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Delete all vendor users (users with active_role 'vendor' or 'vendor' in roles)
    const userResult = await User.deleteMany({ roles: 'vendor' });
    console.log(`Deleted ${userResult.deletedCount} vendor user accounts.`);

    // Delete all vendor storefront profiles
    const vendorResult = await Vendor.deleteMany({});
    console.log(`Deleted ${vendorResult.deletedCount} vendor storefront profiles.`);

    // Delete all menu definitions
    const menuResult = await Menu.deleteMany({});
    console.log(`Deleted ${menuResult.deletedCount} menu definitions.`);

    // Delete all food menu items
    const menuItemResult = await MenuItem.deleteMany({});
    console.log(`Deleted ${menuItemResult.deletedCount} food items.`);

    console.log('All vendor-related data successfully cleared!');
    process.exit(0);
  } catch (err) {
    console.error('Clear failed:', err);
    process.exit(1);
  }
}

clearVendors();
