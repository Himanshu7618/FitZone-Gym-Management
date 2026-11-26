import express from "express";

import {
  createExercise,
  getAllExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
} from "../controllers/exerciseController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all active exercises
router.get(
  "/",
  protect,
  getAllExercises
);

// Get single exercise
router.get(
  "/:id",
  protect,
  getExerciseById
);

// Admin / Trainer - Create
router.post(
  "/",
  protect,
  authorizeRoles("admin", "trainer"),
  createExercise
);

// Admin / Trainer - Update
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "trainer"),
  updateExercise
);

// Admin - Delete
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteExercise
);

export default router;