import express from "express";
import { getReports } from "../controllers/reportController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only reports
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getReports
);

export default router;