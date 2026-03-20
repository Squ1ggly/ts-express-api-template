import express from "express";
import cors from "cors";
import { config } from "dotenv";
import errorMiddleware from "./middleware/error-middleware";
import httpLogger from "./middleware/http-logger-middleware";
import primaryRouter from "./routers/primary-router";
import logger from "./util/logger";

config({ path: `.env${process.env.NODE_ENV === "production" ? "" : ".local"}`, quiet: true });

const requiredEnvironmentVariables = {
  PORT: !!process.env.PORT
};

console.log("Checking required environment variables...", JSON.stringify(requiredEnvironmentVariables, null, 2));

for (const [key, value] of Object.entries(requiredEnvironmentVariables)) {
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
}

const PORT = process.env.PORT;

process.on("uncaughtExceptionMonitor", (e) => {
  logger.error({ err: e }, "Uncaught exception monitor");
});

process.on("uncaughtException", (e) => {
  logger.fatal({ err: e }, "Uncaught exception");
});

const server = express();

async function main() {
  logger.info("Starting server...");
  server.use(cors());
  server.use(httpLogger);
  server.use(
    express.json({
      limit: "1mb",
      verify: (req, _res, buf) => {
        req.raw = buf;
      }
    })
  );
  server.use(express.urlencoded({ extended: true }));

  server.use("/api", primaryRouter);

  server.use((_req, res) => {
    res.status(404).json({ error: { message: "Not found", code: "NOT_FOUND" } });
  });

  server.use(errorMiddleware);

  server.listen(PORT, () => {
    logger.info({ port: PORT, url: `http://localhost:${PORT}` }, "Server started");
  });
}

main();
