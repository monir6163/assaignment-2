import { pool } from "../../../config/db";
import { IBooking } from "./booking.interface";

const createBooking = async (
  bookingData: IBooking & { total_price: number }
) => {
  const queryText =
    "INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
  const values = [
    bookingData.customer_id,
    bookingData.vehicle_id,
    bookingData.rent_start_date,
    bookingData.rent_end_date,
    bookingData.total_price,
    bookingData.status,
  ];
  const result = await pool.query(queryText, values);
  return result.rows[0];
};

const getCustomerById = async (customerId: number) => {
  const queryText =
    "SELECT id, name, email, role, phone FROM users WHERE id = $1";
  const values = [customerId];
  const result = await pool.query(queryText, values);
  return result.rows[0];
};
const getVehicleById = async (vehicleId: number) => {
  const queryText =
    "SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles WHERE id = $1";
  const values = [vehicleId];
  const result = await pool.query(queryText, values);
  return result.rows[0];
};

export const BookingServices = {
  createBooking,
  getCustomerById,
  getVehicleById,
};
