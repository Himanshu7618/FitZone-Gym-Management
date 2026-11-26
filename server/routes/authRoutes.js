import express from "express";
import {
  register,
  login,
    getMe,
} from "../controllers/authController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import {
  createAdmin
} from "../controllers/authController.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/create-admin", createAdmin);
router.get("/protected-test", protect, (req, res) => {
  res.json({
    success: true,
    message: "You can access this protected route.",
    user: req.user,
  });
});


export default router;