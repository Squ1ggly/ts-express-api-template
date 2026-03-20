import { Router } from "express";
import healthController from "../controllers/health-controller";

const primaryRouter = Router();

primaryRouter.get("/v1/health", healthController);

export default primaryRouter;
