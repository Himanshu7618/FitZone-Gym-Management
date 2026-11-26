import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

// MARK ATTENDANCE / CHECK-IN
export const markAttendance = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if attendance already exists today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      user: userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for today",
        attendance: existingAttendance,
      });
    }

    const attendance = await Attendance.create({
      user: userId,
      date: new Date(),
      checkIn: new Date(),
      status: "present",
    });

    const populatedAttendance = await Attendance.findById(
      attendance._id
    ).populate("user", "-password");

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      attendance: populatedAttendance,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// MY ATTENDANCE
export const getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      user: req.user._id,
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET ALL ATTENDANCE - ADMIN
export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("user", "-password")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// CHECK-OUT
export const checkoutAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: "Already checked out",
      });
    }

    attendance.checkOut = new Date();

    await attendance.save();

    const updatedAttendance = await Attendance.findById(
      attendance._id
    ).populate("user", "-password");

    res.status(200).json({
      success: true,
      message: "Check-out successful",
      attendance: updatedAttendance,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET TODAY'S ATTENDANCE - ADMIN
export const getTodayAttendance = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate("user", "-password")
      .sort({ checkIn: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// GET ALL MEMBERS - ADMIN
export const getAttendanceMembers = async (req, res) => {
  try {
    const members = await User.find({
      role: "member",
      status: "active",
    }).select("name email phone");

    res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ADMIN - MARK MEMBER ATTENDANCE
export const adminMarkAttendance = async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (!userId || !["present", "absent"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid userId and status are required",
      });
    }

    const member = await User.findOne({
      _id: userId,
      role: "member",
      status: "active",
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Active member not found",
      });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked today",
      });
    }

    const attendance = await Attendance.create({
      user: userId,
      date: new Date(),
      checkIn: status === "present" ? new Date() : null,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};