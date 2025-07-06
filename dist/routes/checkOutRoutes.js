import express from "express";
import { checkOutControllers } from "../controllers/checkoutControllers.js";
const router = express.Router();
router.route("/sessions").post(checkOutControllers);
export default router;
