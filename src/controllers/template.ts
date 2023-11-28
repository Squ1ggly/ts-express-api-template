import { NextFunction, Response } from "express";
import { IAPIRequest } from "../types/api-types";

export default function testController(req: IAPIRequest, res: Response, next: NextFunction) {
  try {
    req.body;
    req.rawBody;
    res.status(200).send("Hello world!");
    return;
  } catch (error) {
    next(error);
    return;
  }
}
