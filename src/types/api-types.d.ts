import { Request } from "express";

export interface IAPIRequest extends Request {
  rawBody: Buffer;
  body: any;
}
