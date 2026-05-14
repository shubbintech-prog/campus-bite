import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lasustech_eats',
});

import fs from 'fs';

async function check() {
  const [rows] = await pool.query('SELECT name, image_url FROM menu_items');
  fs.writeFileSync('db_output.json', JSON.stringify(rows, null, 2));
  console.log('Output written to db_output.json');
  await pool.end();
}

check();
