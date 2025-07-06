import express from "express";
import { checkOutControllers } from "../controllers/checkoutControllers.js";
import { jwtVerify } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/sessions").post( checkOutControllers);

export default router;
