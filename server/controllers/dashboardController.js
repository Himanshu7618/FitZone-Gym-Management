import User from "../models/User.js";
import Membership from "../models/Membership.js";
import Attendance from "../models/Attendance.js";

// ADMIN DASHBOARD
export const getAdminDashboard = async (req, res) => {
  try {
    // Total members
    const totalMembers = await User.countDocuments({
      role: "member",
    });

    // Active members
    const activeMembers = await User.countDocuments({
      role: "member",
      status: "active",
    });

    // Today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Today's attendance
    const todayAttendance = await Attendance.countDocuments({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: "present",
    });

    // Active memberships
    const activeMemberships = await Membership.countDocuments({
      status: "active",
    });

    // Total paid revenue
    const paidMemberships = await Membership.find({
      paymentStatus: "paid",
    }).populate("plan");

    const totalRevenue = paidMemberships.reduce(
      (total, membership) => {
        return total + (membership.plan?.price || 0);
      },
      0
    );

    // Memberships expiring in next 7 days
    const nextSevenDays = new Date();
    nextSevenDays.setDate(nextSevenDays.getDate() + 7);

    const expiringMemberships = await Membership.countDocuments({
      status: "active",
      endDate: {
        $gte: new Date(),
        $lte: nextSevenDays,
      },
    });

    res.status(200).json({
      success: true,
      dashboard: {
        totalMembers,
        activeMembers,
        todayAttendance,
        activeMemberships,
        totalRevenue,
        expiringMemberships,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// MEMBER DASHBOARD
export const getMemberDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Active membership
    const activeMembership = await Membership.findOne({
      user: userId,
      status: "active",
    }).populate("plan");

    // Total attendance
    const totalAttendance = await Attendance.countDocuments({
      user: userId,
      status: "present",
    });

    // Recent attendance
    const recentAttendance = await Attendance.find({
      user: userId,
    })
      .sort({ date: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      dashboard: {
        profile: {
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone,
          role: req.user.role,
        },

        membership: activeMembership,

        attendance: {
          totalAttendance,
          recentAttendance,
        },
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};