import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../util/http-error";

export default function errorMiddleware(error: unknown, req: Request, res: Response, _next: NextFunction) {
  const isHttpError = error instanceof HttpError;

  const statusCode = isHttpError ? error.statusCode : 500;
  const code = isHttpError ? error.code : "INTERNAL_ERROR";
  const message = isHttpError ? error.message || String(error) : String(error);

  if (statusCode < 500) {
    req.log.warn({ err: error, statusCode }, message);
  } else {
    req.log.error({ err: error, statusCode }, message);
  }

  if (res.headersSent) {
    return;
  }

  res.status(statusCode).json({ error: { message, code } });
}
