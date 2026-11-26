import express from "express";

import {
  getAdminDashboard,
  getMemberDashboard,
} from "../controllers/dashboardController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin Dashboard
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  getAdminDashboard
);

// Member Dashboard
router.get(
  "/member",
  protect,
  authorizeRoles("member"),
  getMemberDashboard
);

export default router;