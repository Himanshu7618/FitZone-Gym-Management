import express from "express";

import {
  createPlan,
  getAllPlans,
  getActivePlans,
  updatePlan,
  deletePlan,
} from "../controllers/membershipPlanController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getActivePlans);

// Admin only
router.get(
  "/admin/all",
  protect,
  authorizeRoles("admin"),
  getAllPlans
);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createPlan
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updatePlan
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deletePlan
);

export default router;