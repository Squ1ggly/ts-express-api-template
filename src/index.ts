import express from "express";
import errorMiddleware from "./middleware/error-middleware";
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
  // Allow from any origin
  server.use(cors());
  server.use((req, _res, next) => {
    // Omit code from being logged
    console.info(`${req.method} request received PATH: ${req.originalUrl?.split("?")[0]}`);
    next();
  });

  server.use(
    express.json({
      limit: "100mb",
      type: "application/json",
      verify: (req, _res, buf, _encoding) => {
        req.raw = buf;
      }
    })
  );
  server.use(express.urlencoded({ extended: true }));

  server.use("/api", primaryRouter);

  // Fallback redirect
  server.use("/", (req, res, next) => {
    res.status(400).send("Not a valid route");
    return;
  });

  server.listen(PORT, () => {
    console.info(`Listening on port ${PORT} URL: http://localhost:${PORT}`);
  });

  server.use(errorMiddleware);
}

main();
