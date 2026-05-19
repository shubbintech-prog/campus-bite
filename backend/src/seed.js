import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

import User from './models/User.js';
import Vendor from './models/Vendor.js';
import Menu from './models/Menu.js';
import MenuItem from './models/MenuItem.js';
import Wallet from './models/Wallet.js';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Wipe existing data
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await Menu.deleteMany({});
    await MenuItem.deleteMany({});
    await Wallet.deleteMany({});
    console.log('Cleared existing collections.');

    const commonPassword = await hashPassword('CampusBites2026!');

    // 1. Seed Admins
    const admins = [
      { name: 'Super Admin', email: 'admin@campusbites.com', role: 'admin' },
      { name: 'Audit Admin', email: 'auditor@campusbites.com', role: 'admin' },
      { name: 'Support Admin', email: 'support@campusbites.com', role: 'admin' },
    ];
    for (const a of admins) {
      await User.create({ ...a, password_hash: commonPassword });
    }
    console.log('Admins seeded.');

    // 2. Seed Students
    const students = [
      { name: 'Adebayo Johnson', email: 'adebayo@campusbites.com', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      { name: 'Chioma Okafor', email: 'chioma@campusbites.com', image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
      { name: 'Emeka Nwosu', email: 'emeka@campusbites.com', image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      { name: 'Fatima Bello', email: 'fatima@campusbites.com', image_url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80' },
      { name: 'Olumide Bakare', email: 'olumide@campusbites.com', image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
      { name: 'Zainab Musa', email: 'zainab@campusbites.com', image_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80' },
      { name: 'Tunde Afolayan', email: 'tunde@campusbites.com', image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
      { name: 'Ifeoma Eze', email: 'ife@campusbites.com', image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
      { name: 'Segun Arinze', email: 'segun@campusbites.com', image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
      { name: 'Nike Adeyemi', email: 'nike@campusbites.com', image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80' },
      { name: 'Kunle Afolayan', email: 'kunle@campusbites.com', image_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
      { name: 'Yinka Ayefele', email: 'yinka@campusbites.com', image_url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
      { name: 'Boluwatife Ajayi', email: 'bolu@campusbites.com', image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
      { name: 'Dapo Abiodun', email: 'dapo@campusbites.com', image_url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=200&q=80' },
    ];

    for (const s of students) {
      const user = await User.create({ ...s, image_url: '', password_hash: commonPassword, role: 'student' });
      await Wallet.create({ user: user._id, balance: 5000 });
    }
    console.log('Students seeded.');

    // 3. Menu item templates
    const menuItems = {
      Rice: [
        { name: 'Jollof Rice Special', desc: 'Smoky jollof rice with chicken & dodo.', price: 2500, img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=800' },
        { name: 'Fried Rice & Turkey', desc: 'Stir-fry rice with veggies & turkey.', price: 3500, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800' },
        { name: 'Coconut Rice', desc: 'Sweet coconut rice with prawns.', price: 2800, img: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&q=80&w=800' },
        { name: 'Ofada Rice & Stew', desc: 'Bukka style ofada with ayamase.', price: 3000, img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=800' },
      ],
      Swallow: [
        { name: 'Amala & Ewedu', desc: 'Soft amala with gbegiri & assorted.', price: 2000, img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=800' },
        { name: 'Pounded Yam & Egusi', desc: 'Freshly pounded yam with egusi.', price: 2500, img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=800' },
        { name: 'Eba & Okra Soup', desc: 'Garri with seafood okra soup.', price: 1800, img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=800' },
      ],
      Pizza: [
        { name: 'Margherita Pizza', desc: 'Classic tomato & mozzarella.', price: 4000, img: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=800' },
        { name: 'Pepperoni Feast', desc: 'Double pepperoni with cheese.', price: 5500, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800' },
        { name: 'BBQ Chicken Pizza', desc: 'Grilled chicken & BBQ sauce.', price: 6000, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800' },
      ],
      FastFood: [
        { name: 'Chicken Shawarma', desc: 'Double sausage special wrap.', price: 1500, img: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&q=80&w=800' },
        { name: 'Beef Shawarma Deluxe', desc: 'Spiced beef in garlic sauce.', price: 1800, img: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&q=80&w=800' },
        { name: 'Suya Platter', desc: 'Spicy grilled beef with onions.', price: 2500, img: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800' },
      ],
      Drinks: [
        { name: 'Coke (50cl)', desc: 'Chilled soft drink.', price: 400, img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800' },
        { name: 'Maltina', desc: 'Nourishing malt drink.', price: 600, img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800' },
        { name: 'Bottled Water', desc: 'Refreshing spring water.', price: 200, img: 'https://images.unsplash.com/photo-1548839140-29a742115f08?auto=format&fit=crop&q=80&w=800' },
        { name: 'Chapman', desc: 'Nigerian special cocktail.', price: 1500, img: 'https://images.unsplash.com/photo-1513558111299-67ff2213425f?auto=format&fit=crop&q=80&w=800' },
      ],
    };

    const vendorTypes = [
      { name: "Mama T's Kitchen", email: 'mamat@campusbites.com', landmark: 'Activities Area (Shop 01)', cats: ['Rice', 'Swallow', 'Drinks'] },
      { name: 'Iya Yinka Food', email: 'iyayinka@campusbites.com', landmark: 'Activities Area (Shop 05)', cats: ['Rice', 'Swallow', 'Drinks'] },
      { name: 'Iya Awesu Special', email: 'iyaawesu@campusbites.com', landmark: 'Activities Area (Shop 12)', cats: ['Rice', 'Swallow', 'Drinks'] },
      { name: 'Blue Roof', email: 'blueroof@campusbites.com', landmark: 'Activities Area (Shop 08)', cats: ['Rice', 'Drinks'] },
      { name: 'The Place Ikorodu', email: 'theplace@campusbites.com', landmark: 'Activities Area (Shop 15)', cats: ['Rice', 'FastFood', 'Drinks'] },
      { name: 'Alubarika Food Canteen', email: 'alubarika@campusbites.com', landmark: 'Activities Area (Shop 03)', cats: ['Rice', 'Swallow'] },
      { name: 'Anchor Point Grills', email: 'anchor@campusbites.com', landmark: 'Activities Area (Shop 22)', cats: ['FastFood', 'Drinks'] },
      { name: 'Daregos Restaurant', email: 'daregos@campusbites.com', landmark: 'Activities Area (Shop 18)', cats: ['Rice', 'Swallow'] },
      { name: 'Emesco Restaurant', email: 'emesco@campusbites.com', landmark: 'Activities Area (Shop 10)', cats: ['Rice', 'Drinks'] },
      { name: 'Madam Favour Special', email: 'favour@campusbites.com', landmark: 'Activities Area (Shop 07)', cats: ['Swallow'] },
      { name: 'Mrs Iremu Canteen', email: 'iremu@campusbites.com', landmark: 'Activities Area (Shop 25)', cats: ['Rice', 'Swallow'] },
      { name: "O'mine's Chow", email: 'omines@campusbites.com', landmark: 'Activities Area (Shop 14)', cats: ['FastFood', 'Drinks'] },
      { name: 'Spring Tree Chinese', email: 'spring@campusbites.com', landmark: 'Activities Area (Shop 30)', cats: ['Rice'] },
      { name: 'Shawarma Palace', email: 'shawarma@campusbites.com', landmark: 'Activities Area (Shop 11)', cats: ['FastFood', 'Drinks'] },
      { name: 'Student Grills', email: 'grills@campusbites.com', landmark: 'Activities Area (Shop 09)', cats: ['FastFood', 'Drinks'] },
      { name: 'Chicken Republic', email: 'cr@campusbites.com', landmark: 'Activities Area (Shop 02)', cats: ['FastFood', 'Drinks'] },
      { name: 'Sweet Sensation', email: 'sweet@campusbites.com', landmark: 'Activities Area (Shop 20)', cats: ['FastFood', 'Pizza', 'Drinks'] },
      { name: 'Bukka Hut', email: 'bukka@campusbites.com', landmark: 'Activities Area (Shop 04)', cats: ['Swallow', 'Rice'] },
      { name: 'Tasty Fried Chicken', email: 'tasty@campusbites.com', landmark: 'School of Engineering', cats: ['FastFood', 'Drinks'] },
      { name: 'Pizza Hub', email: 'pizzahub@campusbites.com', landmark: 'School of Technology', cats: ['Pizza', 'Drinks'] },
    ];

    const vPhotos = [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7ed938cabd?auto=format&fit=crop&w=800&q=80',
    ];

    for (const v of vendorTypes) {
      // Create vendor user account
      await User.create({ name: v.name, email: v.email, password_hash: commonPassword, role: 'vendor' });

      const vendor = await Vendor.create({
        vendor_name: v.name,
        owner_name: v.name,
        email: v.email,
        phone: '080' + Math.floor(Math.random() * 90000000),
        location: 'Main Campus',
        location_landmark: v.landmark,
        status: 'active',
        image_url: '',
      });

      const menu = await Menu.create({ vendor: vendor._id, menu_name: 'Daily Menu' });

      let count = 0;
      for (const cat of v.cats) {
        const items = menuItems[cat] || [];
        for (const item of items) {
          const finalCategory = cat === 'Rice' || cat === 'Swallow' ? 'Nigerian' : cat;
          await MenuItem.create({
            menu: menu._id,
            name: item.name,
            description: item.desc,
            price: item.price,
            category: finalCategory,
            image_url: '',
          });
          count++;
        }
      }

      while (count < 10) {
        await MenuItem.create({
          menu: menu._id,
          name: `Special Item ${count}`,
          description: 'Our delicious chef choice meal.',
          price: 1200 + count * 100,
          category: 'General',
          image_url: '',
        });
        count++;
      }
    }

    console.log('Vendors and menus seeded.');
    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
