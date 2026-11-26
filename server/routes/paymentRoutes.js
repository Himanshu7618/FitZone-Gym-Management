import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
   getMyPaymentHistory,
  getAllPaymentHistory,
} from "../controllers/paymentController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPayment);
router.get("/my-history", protect, getMyPaymentHistory);

router.get(
  "/all-history",
  protect,
  authorizeRoles("admin"),
  getAllPaymentHistory
);

export default router;