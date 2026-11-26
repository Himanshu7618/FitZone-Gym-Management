
import express from "express";

import {
  addProgress,
  getMyProgress,
  getAllProgress,
  updateProgress,
  deleteProgress,
} from "../controllers/progressController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Member: Add progress
router.post(
  "/",
  protect,
  authorizeRoles("member"),
  addProgress
);

// Member: Get own progress history
router.get(
  "/my",
  protect,
  authorizeRoles("member"),
  getMyProgress
);

// Admin: Get all members' progress
router.get(
  "/all",
  protect,
  authorizeRoles("admin"),
  getAllProgress
);


 // Member: Update own progress
router.put(
  "/:id",
  protect,
  authorizeRoles("member"),
  updateProgress
);

// Member: Delete own progress
router.delete(
  "/:id",
  protect,
  authorizeRoles("member"),
  deleteProgress
);


export default router;
