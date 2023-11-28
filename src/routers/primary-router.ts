import { Router } from "express";
import testController from "../controllers/template";

const primaryRouter = Router();

primaryRouter.post("/test", testController);

export default primaryRouter;
