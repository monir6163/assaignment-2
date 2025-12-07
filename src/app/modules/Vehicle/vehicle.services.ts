import { StatusCodes } from "http-status-codes";
import { pool } from "../../../config/db";
import ApiError from "../../errors/ApiError";
import { IVehicle } from "./vehicle.interface";

const createVehicle = async (payload: IVehicle) => {
  const queryText = `INSERT INTO vehicles 
    (vehicle_name, type, registration_number, daily_rent_price, availability_status) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const values = [
    payload.vehicle_name,
    payload.type,
    payload.registration_number,
    payload.daily_rent_price,
    payload.availability_status,
  ];
  const result = await pool.query(queryText, values);
  return result.rows[0];
};
const getAllVehicles = async (): Promise<IVehicle[]> => {
  const queryText = `SELECT * FROM vehicles ORDER BY created_at DESC`;
  const result = await pool.query(queryText);
  return result.rows;
};

const getVehicleById = async (vehicleId: number): Promise<IVehicle | null> => {
  const queryText = `SELECT * FROM vehicles WHERE id = $1`;
  const values = [vehicleId];
  const result = await pool.query(queryText, values);
  return result.rows[0] || null;
};

const updateVehicle = async (
  vehicleId: number,
  payload: Partial<IVehicle>
): Promise<IVehicle | null> => {
  const existingVehicle = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1`,
    [vehicleId]
  );

  if (existingVehicle.rows.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Vehicle not found");
  }

  const updatedVehicle: IVehicle = {
    ...existingVehicle.rows[0],
    ...payload,
  };
  const queryText = `UPDATE vehicles SET 
    vehicle_name = $1, 
    type = $2, 
    registration_number = $3, 
    daily_rent_price = $4, 
    availability_status = $5 
    WHERE id = $6 RETURNING *`;

  const values = [
    updatedVehicle.vehicle_name,
    updatedVehicle.type,
    updatedVehicle.registration_number,
    updatedVehicle.daily_rent_price,
    updatedVehicle.availability_status,
    vehicleId,
  ];

  const result = await pool.query(queryText, values);
  return result.rows[0];
};
const deleteVehicle = async (vehicleId: number): Promise<IVehicle | null> => {
  const existingVehicle = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1`,
    [vehicleId]
  );
  if (existingVehicle.rows.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Vehicle not found");
  }
  const queryText = `DELETE FROM vehicles WHERE id = $1 RETURNING *`;
  const values = [vehicleId];
  const result = await pool.query(queryText, values);
  return result.rows[0];
};

export const VehicleService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
