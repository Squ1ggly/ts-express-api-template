import { NextFunction, Response, Request } from "express";

export default function testController(req: Request, res: Response, next: NextFunction) {
  try {
    console.log(req.body);
    console.log(req.raw);
    res.status(200).send("Hello world!");
    return;
  } catch (error) {
    next(error);
    return;
  }
}
