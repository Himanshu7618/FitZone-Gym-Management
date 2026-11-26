import express from "express";

import {
  markAttendance,
  getMyAttendance,
  getAllAttendance,
  checkoutAttendance,
  getTodayAttendance,
  getAttendanceMembers,
   adminMarkAttendance,
} from "../controllers/attendanceController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Member - Mark Attendance / Check-in
router.post(
  "/",
  protect,
  authorizeRoles("member"),
  markAttendance
);

// Member - My Attendance
router.get(
  "/my",
  protect,
  authorizeRoles("member"),
  getMyAttendance
);

// Admin - Today's Attendance
router.get(
  "/today",
  protect,
  authorizeRoles("admin"),
  getTodayAttendance
);

router.get(
  "/members",
  protect,
  authorizeRoles("admin"),
  getAttendanceMembers
);

// Admin - Mark Member Attendance
router.post(
  "/admin-mark",
  protect,
  authorizeRoles("admin"),
  adminMarkAttendance
);

// Admin - Get All Attendance
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllAttendance
);

// Member - Check-out
router.put(
  "/:id/checkout",
  protect,
  authorizeRoles("member"),
  checkoutAttendance
);

export default router;