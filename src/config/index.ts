import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_DEV,
  port: process.env.PORT ? Number(process.env.PORT) : 8080,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS
    ? Number(process.env.BCRYPT_SALT_ROUNDS)
    : 10,
  database_url: process.env.DATABASE_URL,
  cron_job_secret: process.env.CRON_JOB_SECRET,
  jwt: {
    secret_token: process.env.JWT_SECKRET_TOKEN,
    secret_expires: process.env.JWT_EXPIRE_IN,
  },
};
