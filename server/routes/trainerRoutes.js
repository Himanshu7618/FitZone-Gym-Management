import express from "express";

import {
  createTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
  getMyTrainerProfile,
  getActiveMembers,
} from "../controllers/trainerController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ADMIN - Create Trainer
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createTrainer
);

// ADMIN - Get All Trainers
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllTrainers
);

// TRAINER - My Profile
router.get(
  "/my",
  protect,
  authorizeRoles("trainer"),
  getMyTrainerProfile
);
// TRAINER - Get Active Members
router.get(
  "/members/active",
  protect,
  authorizeRoles("trainer"),
  getActiveMembers
);

// ADMIN - Get Single Trainer
router.get(
  "/:id",
  protect,
  authorizeRoles("admin"),
  getTrainerById
);

// ADMIN - Update Trainer
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateTrainer
);

// ADMIN - Delete Trainer
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteTrainer
);

export default router;