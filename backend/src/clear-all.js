import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

import User from './models/User.js';
import Vendor from './models/Vendor.js';
import Menu from './models/Menu.js';
import MenuItem from './models/MenuItem.js';
import Notification from './models/Notification.js';
import Order from './models/Order.js';
import OrderTimeline from './models/OrderTimeline.js';
import Payment from './models/Payment.js';
import Session from './models/Session.js';
import VendorApplication from './models/VendorApplication.js';
import VendorProfile from './models/VendorProfile.js';
import Wallet from './models/Wallet.js';
import WalletTransaction from './models/WalletTransaction.js';

async function clearAll() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected. Starting database purge...');

    // Delete all records from all collections
    const collections = [
      { name: 'User', model: User },
      { name: 'Vendor', model: Vendor },
      { name: 'Menu', model: Menu },
      { name: 'MenuItem', model: MenuItem },
      { name: 'Notification', model: Notification },
      { name: 'Order', model: Order },
      { name: 'OrderTimeline', model: OrderTimeline },
      { name: 'Payment', model: Payment },
      { name: 'Session', model: Session },
      { name: 'VendorApplication', model: VendorApplication },
      { name: 'VendorProfile', model: VendorProfile },
      { name: 'Wallet', model: Wallet },
      { name: 'WalletTransaction', model: WalletTransaction }
    ];

    for (const col of collections) {
      if (col.model) {
        const result = await col.model.deleteMany({});
        console.log(`Deleted ${result.deletedCount} documents from ${col.name} collection.`);
      } else {
        console.log(`Skipping ${col.name} as model was not found.`);
      }
    }

    console.log('Database successfully purged! All collections are clean.');
    process.exit(0);
  } catch (err) {
    console.error('Database purge failed:', err);
    process.exit(1);
  }
}

clearAll();
