import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Parse DATABASE_URL if it exists (MySQL format: mysql://user:password@host:port/database)
const dbConfig = {
  uri: process.env.DATABASE_URL || 'mysql://root@localhost:3306/lasustech_eats'
};

const pool = mysql.createPool(process.env.DATABASE_URL || {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lasustech_eats',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('Connecting to MySQL database...');

export const query = async (sql, params) => {
  return await pool.execute(sql, params);
};

export default pool;
