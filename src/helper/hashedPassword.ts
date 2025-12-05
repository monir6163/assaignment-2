import bycrypt from "bcryptjs";
import config from "../config";
const hashedPassword = async (password: string): Promise<string> => {
  return await bycrypt.hash(password, config.bcrypt_salt_rounds);
};
const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bycrypt.compare(password, hashedPassword);
};
export const hashedPasswordHelper = {
  hashedPassword,
  comparePassword,
};
