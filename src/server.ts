import { Server } from "http";
import app from "./app";
import connectDB from "./config/db";
import config from "./config/index";
import AdminCreateInitialData from "./helper/seed";

process.on("uncaughtException", (error) => {
  console.log(error);
  process.exit(1);
});

let server: Server;

async function connection() {
  try {
    await connectDB();
    console.log("DB is connected succesfully ....!!");
    await AdminCreateInitialData();
    server = app.listen(config.port, () => {
      console.log(`Application is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log("server connection error", err);
  }
  process.on("unhandledRejection", (error) => {
    if (server) {
      server.close(() => {
        console.log(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}
connection();
