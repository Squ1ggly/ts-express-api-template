import express from "express";
import errorMiddleware from "./middleware/error-middleware";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import assert from "node:assert";
import primaryRouter from "./routers/primary-router";

config();

assert(process.env.PORT, ".env must contain PORT");

const PORT = process.env.PORT || 5102;

process.on("uncaughtExceptionMonitor", (e) => {
  console.error(e);
});

process.on("uncaughtException", (e) => {
  console.error("Uncaught exception: " + e);
});

const server = express();

function main() {
  server.use(cors());
  server.use((req, res, next) => {
    // Omit code from being logged
    console.info(`${req.method} request received PATH: ${req.originalUrl?.split("?")[0]}`);
    next();
  });

  const includeRawBodyOptions: bodyParser.Options = {
    limit: "100mb",
    type: "application/json",
    verify: (req: any, res, buf) => {
      // Include rawBody in request, because express removed it in 1.5.1
      // Useful for hashing so its byte for byte.
      req.rawBody = buf;
    }
  };

  server.use(bodyParser.json(includeRawBodyOptions));
  server.use(bodyParser.urlencoded({ extended: true }));

  server.use("/api", primaryRouter);

  // Fallback redirect
  server.use("/", (req, res, next) => {
    next("Not a valid route");
    return;
  });

  server.listen(PORT, () => {
    console.info(`Listening on port ${PORT} URL: http://localhost:${PORT}`);
  });

  server.use(errorMiddleware);
}

main();
