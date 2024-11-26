import { Router } from "express";
import testController from "../controllers/template";

const primaryRouter = Router();

primaryRouter.route("/test").post(testController).get(testController);

export default primaryRouter;
