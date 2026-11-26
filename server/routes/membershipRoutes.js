import express from "express";

import {
  createMembership,
  getMyMembership,
  getAllMemberships,
  updateMembership,
} from "../controllers/membershipController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin - create membership
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createMembership
);

// Logged-in member - own memberships
router.get(
  "/my",
  protect,
  getMyMembership
);

// Admin - all memberships
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllMemberships
);

// Admin - update membership
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateMembership
);

export default router;