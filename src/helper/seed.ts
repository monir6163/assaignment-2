import { pool } from "../config/db";
import { hashedPasswordHelper } from "./hashedPassword";

const AdminCreateInitialData = async () => {
  try {
    const hashedPassword = await hashedPasswordHelper.hashedPassword(
      "adminpassword"
    );
    // check if admin user exists
    const res = await pool.query(
      `SELECT * FROM users WHERE role='admin' LIMIT 1`
    );
    if (res.rows.length > 0) {
      console.log("Admin user already exists. Skipping initial data creation.");
      return;
    }
    console.log("Admin creating initial data...");
    await pool.query(`
      INSERT INTO users (name, email, role, password, phone, created_at, updated_at)
      VALUES ('Admin User', 'admin@admin.com', 'admin', '${hashedPassword}', '1234567890', NOW(), NOW())
    `);
    console.log("Initial data created successfully.");
  } catch (error: unknown) {
    console.log((error as Error).message);
  }
};

export default AdminCreateInitialData;
