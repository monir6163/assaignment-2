import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: `${config.database_url}`,
});

const connectDB = async () => {
  // create users table if not exists
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL CHECK(email=lower(email)),
    password VARCHAR(255) NOT NULL CHECK(length(password) >= 6),
    phone VARCHAR(15) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer' CHECK(role IN('admin', 'customer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  // create Vehicles table if not exists
  await pool.query(`CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(255) NOT NULL,
      type VARCHAR(20) NOT NULL CHECK(type IN('car','bike','van','SUV')),
      registration_number VARCHAR(255) UNIQUE NOT NULL,
      daily_rent_price DECIMAL(10, 2) NOT NULL CHECK(daily_rent_price > 0),
      availability_status VARCHAR(20) NOT NULL CHECK(availability_status IN('available','booked')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
  // create bookings table if not exists
  await pool.query(`CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL CHECK(rent_end_date > rent_start_date),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price > 0),
    status VARCHAR(20) NOT NULL CHECK(status IN ('active','cancelled','returned')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
  // create user_sessions table if not exists
  // await pool.query(`CREATE TABLE IF NOT EXISTS user_sessions (
  //     id SERIAL PRIMARY KEY,
  //     user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  //     refresh_token TEXT NOT NULL,
  //     user_agent TEXT,
  //     ip_address VARCHAR(50),
  //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  //   )`);
};
export default connectDB;
