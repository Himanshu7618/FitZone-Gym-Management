
import express from "express";

import {
  createDietPlan,
  getTrainerDietPlans,
  getMyDietPlans,
  getAllDietPlans,
   updateDietPlan,
  deleteDietPlan,
} from "../controllers/dietPlanController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Trainer: Create diet plan
router.post(
  "/",
  protect,
  authorizeRoles("trainer"),
  createDietPlan
);

// Trainer: Get own diet plans
router.get(
  "/trainer",
  protect,
  authorizeRoles("trainer"),
  getTrainerDietPlans
);

// Member: Get own diet plans
router.get(
  "/my",
  protect,
  authorizeRoles("member"),
  getMyDietPlans
);

// Admin: Get all diet plans
router.get(
  "/all",
  protect,
  authorizeRoles("admin"),
  getAllDietPlans
);

router.put(
  "/:id",
  protect,
  authorizeRoles("trainer"),
  updateDietPlan
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("trainer"),
  deleteDietPlan
);


export default router;
