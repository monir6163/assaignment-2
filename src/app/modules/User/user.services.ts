import { pool } from "../../../config/db";
import { IUser } from "./user.interface";

const getAllUsers = async () => {
  const queryText = `SELECT id, name, email, role, phone, created_at, updated_at FROM users ORDER BY created_at DESC`;
  const result = await pool.query(queryText);
  return result.rows as IUser[];
};

const deleteUserById = async (userId: number) => {
  const queryText = `DELETE FROM users WHERE id = $1 RETURNING *`;
  const checkBookingsQuery = `SELECT COUNT(*) FROM bookings WHERE user_id = $1 AND status = 'active'`;
  const bookingsResult = await pool.query(checkBookingsQuery, [userId]);
  if (parseInt(bookingsResult.rows[0].count, 10) > 0) {
    return null;
  }
  const result = await pool.query(queryText, [userId]);
  return result.rows[0] as IUser | null;
};

export const UserServices = {
  getAllUsers,
  deleteUserById,
};
