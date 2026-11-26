
import express from "express";
import {
  createWorkout,
  getTrainerWorkouts,
  getMyWorkouts,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} from "../controllers/workoutController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Trainer routes
router.post(
  "/",
  protect,
  authorizeRoles("trainer"),
  createWorkout
);

router.get(
  "/trainer",
  protect,
  authorizeRoles("trainer"),
  getTrainerWorkouts
);

// Member routes
router.get(
  "/my",
  protect,
  authorizeRoles("member"),
  getMyWorkouts
);

// Admin routes
router.get(
  "/all",
  protect,
  authorizeRoles("admin"),
  getAllWorkouts
);

// Common workout routes
router.get("/:id", protect, getWorkoutById);
// console.log("Workout PUT route loaded");
router.put(
  "/:id",
  protect,
  authorizeRoles("trainer", "admin", "member"),
  updateWorkout
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("trainer", "admin"),
  deleteWorkout
);

export default router;
