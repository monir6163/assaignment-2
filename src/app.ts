import express, { Application } from "express";
import { StatusCodes } from "http-status-codes";
import globalErrorHandler from "./app/middleware/GlobalErrorHandler";
import notFound from "./app/middleware/NotFound";
import routes from "./app/routes";
import sendResponse from "./shared/sendResponse";

const app: Application = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// health check
app.get("/", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    data: {
      message: "Server is running",
      author: "Md. Monir Hossain",
      version: "1.0.0",
      host: req.hostname,
      protocol: req.protocol,
      ip: ip,
      time: new Date().toISOString(),
    },
  });
  res.end();
});

// use routes
app.use("/api/v1", routes);

// global Error
app.use(globalErrorHandler);
// handle not found
app.use(notFound);

export default app;
