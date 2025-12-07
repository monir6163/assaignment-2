import { StatusCodes } from "http-status-codes";
import { pool } from "../../../config/db";
import ApiError from "../../errors/ApiError";
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
  if (!result.rows[0]) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to create booking."
    );
  }
  const updateVehicleQuery =
    "UPDATE vehicles SET availability_status = 'booked' WHERE id = $1";
  await pool.query(updateVehicleQuery, [bookingData.vehicle_id]);
  return result.rows[0];
};
const adminGetAllBookings = async () => {
  const queryText = `
    SELECT 
      b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status, c.name AS customer_name, c.email AS customer_email,
      v.vehicle_name, v.daily_rent_price, v.registration_number
    FROM bookings b
    JOIN users c ON b.customer_id = c.id
    JOIN vehicles v ON b.vehicle_id = v.id
    ORDER BY b.created_at DESC
  `;
  const result = await pool.query(queryText);
  return result?.rows?.map((row) => ({
    id: row.id,
    customer_id: row.customer_id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: Number(row.total_price),
    status: row.status,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
    },
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
    },
  }));
};
const customerGetAllBookings = async (customerId: number) => {
  const queryText = `
    SELECT 
      b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
      v.vehicle_name, v.daily_rent_price, v.registration_number, v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.created_at DESC
  `;
  const values = [customerId];
  const result = await pool.query(queryText, values);
  return result?.rows?.map((row) => ({
    id: row.id,
    customer_id: row.customer_id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: Number(row.total_price),
    status: row.status,
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
      type: row.type,
    },
  }));
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
const getBookingById = async (bookingId: number) => {
  const queryText =
    "SELECT id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status FROM bookings WHERE id = $1";
  const values = [bookingId];
  const result = await pool.query(queryText, values);
  return result.rows[0];
};
const updateVehicleAvailability = async (
  vehicleId: number,
  availabilityStatus: "available" | "booked"
) => {
  const queryText = `
    UPDATE vehicles
    SET availability_status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status, created_at, updated_at
  `;
  const values = [availabilityStatus, vehicleId];
  const result = await pool.query(queryText, values);
  return result.rows[0];
};
const updateBookingStatus = async (
  bookingId: number,
  status: "cancelled" | "returned"
) => {
  const queryText = `
    UPDATE bookings
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, created_at, updated_at
  `;
  const values = [status, bookingId];
  const result = await pool.query(queryText, values);
  return result.rows[0];
};
const bookingsAutoReturnForExpired = async () => {
  const expiredBookingsQueryText = `
    SELECT id, vehicle_id FROM bookings
    WHERE status = 'active' AND rent_end_date < NOW()
  `;
  const expiredBookingsResult = await pool.query(expiredBookingsQueryText);
  const expiredBookings = expiredBookingsResult.rows;
  if (expiredBookings.length === 0) {
    return;
  }
  for (const booking of expiredBookings) {
    const updateBookingQueryText = `
      UPDATE bookings
      SET status = 'returned', updated_at = NOW()
      WHERE id = $1
    `;
    await pool.query(updateBookingQueryText, [booking.id]);
    const updateVehicleQueryText = `
      UPDATE vehicles
      SET availability_status = 'available', updated_at = NOW()
      WHERE id = $1
    `;
    await pool.query(updateVehicleQueryText, [booking.vehicle_id]);
  }
  return;
};

export const BookingServices = {
  createBooking,
  adminGetAllBookings,
  customerGetAllBookings,
  getCustomerById,
  getVehicleById,
  getBookingById,
  updateBookingStatus,
  updateVehicleAvailability,
  bookingsAutoReturnForExpired,
};
