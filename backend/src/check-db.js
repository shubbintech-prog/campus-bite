import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './models/MenuItem.js';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
  
  const items = await MenuItem.find({});
  console.log('Total items in DB:', items.length);
  for (const item of items) {
    console.log(`Item: ${item.name}, Image URL: "${item.image_url}"`);
  }
  
  await mongoose.disconnect();
}

run().catch(console.error);
