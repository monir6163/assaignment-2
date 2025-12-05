import { StatusCodes } from "http-status-codes";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { pool } from "../../../config/db";
import { hashedPasswordHelper } from "../../../helper/hashedPassword";
import { jwtHelpers } from "../../../helper/jwtHelpers";
import ApiError from "../../errors/ApiError";
import { ISignupUser } from "./auth.interface";

const signupUser = async (payload: ISignupUser) => {
  const { name, email, password, phone } = payload;
  const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (userExists.rowCount! > 0) {
    throw new ApiError(StatusCodes.CONFLICT, "User already exists!!");
  }
  const hashedPassword = await hashedPasswordHelper.hashedPassword(password);
  const result = await pool.query(
    "INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email.toLowerCase(), hashedPassword, phone]
  );
  const withoutPasswordUser = { ...result.rows[0] };
  delete withoutPasswordUser.password;
  return withoutPasswordUser as ISignupUser;
};
const loginUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;
  const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (userExists.rowCount === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not exists!!");
  }
  const isPasswordMatched = await hashedPasswordHelper.comparePassword(
    password,
    userExists.rows[0].password
  );
  if (!isPasswordMatched) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Password is incorrect");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      email: userExists.rows[0].email,
      role: userExists.rows[0].role,
    },
    config.jwt.secret_token as Secret,
    config.jwt.secret_expires as string
  );
  const withoutPasswordUser = { ...userExists.rows[0] };
  delete withoutPasswordUser.password;

  return {
    token: accessToken,
    user: withoutPasswordUser,
  };
};

export const AuthServices = {
  signupUser,
  loginUser,
};
