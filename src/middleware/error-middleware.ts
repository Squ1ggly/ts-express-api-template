import { NextFunction, Request, Response } from "express";

export default function errorMiddleware(error: string, req: Request, res: Response, next: NextFunction) {
  console.error(error);
  if (res.headersSent) {
    return;
  }
  res.sendStatus(500);
  return;
}
