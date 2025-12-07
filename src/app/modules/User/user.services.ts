import { pool } from "../../../config/db";
import { hashedPasswordHelper } from "../../../helper/hashedPassword";
import ApiError from "../../errors/ApiError";
import { IUser } from "./user.interface";

const getAllUsers = async () => {
  const queryText = `SELECT id, name, email, role, phone, created_at, updated_at FROM users ORDER BY created_at DESC`;
  const result = await pool.query(queryText);
  return result.rows as IUser[];
};
const getUserByRegistationNumber = async (email: string) => {
  const queryText = `SELECT id, name, email, role, phone, created_at, updated_at FROM users WHERE email = $1`;
  const result = await pool.query(queryText, [email]);
  return result.rows[0] as IUser | null;
};

const updateUserById = async (userId: number, updateData: Partial<IUser>) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in updateData) {
    fields.push(`${key} = $${index}`);
    values.push((updateData as any)[key]);
    index++;
  }

  if (fields.length === 0) {
    return null;
  }
  const hashedPasswordIndex = fields.findIndex((field) =>
    field.startsWith("password =")
  );
  if (hashedPasswordIndex !== -1) {
    const hashedPassword = await hashedPasswordHelper.hashedPassword(
      values[hashedPasswordIndex]
    );
    values[hashedPasswordIndex] = hashedPassword;
  }
  const queryText = `UPDATE users SET ${fields.join(
    ", "
  )}, updated_at = NOW() WHERE id = $${index} RETURNING id, name, email, role, phone, created_at, updated_at`;
  values.push(userId);
  const result = await pool.query(queryText, values);
  return result.rows[0] as IUser | null;
};

const deleteUserById = async (userId: number) => {
  const queryText = `DELETE FROM users WHERE id = $1 RETURNING *`;
  const checkBookingsQuery = `SELECT COUNT(*) FROM bookings WHERE customer_id = $1 AND status = 'active'`;
  const bookingsResult = await pool.query(checkBookingsQuery, [userId]);
  if (parseInt(bookingsResult.rows[0].count, 10) > 0) {
    throw new ApiError(400, "Cannot delete user with active bookings");
  }
  const result = await pool.query(queryText, [userId]);
  return result.rows[0] as IUser | null;
};

export const UserServices = {
  getAllUsers,
  getUserByRegistationNumber,
  updateUserById,
  deleteUserById,
};
