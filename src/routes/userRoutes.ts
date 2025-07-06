import express from "express";
import {
  loginWithGoogle,
  signupController,
  upgradePlan,
  verfiyUser,
  verifyEmail,
} from "../controllers/userControllers.js";
import { jwtVerify } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/auth").post(signupController);
router.route("/verify-user").post(verifyEmail);
router.route("/login-with-google").post(loginWithGoogle);
router.route("/verify-user").get(jwtVerify, verfiyUser);
router.route("/upgrade-plan").post(jwtVerify, upgradePlan);

export default router;
