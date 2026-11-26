import User from "../models/User.js";
import Membership from "../models/Membership.js";
import Attendance from "../models/Attendance.js";

// ADMIN REPORTS
export const getReports = async (req, res) => {
  try {
    // Total members
    const totalMembers = await User.countDocuments({
      role: "member",
    });

    // Monthly new members (last 6 months)
    const monthlyMembers = await User.aggregate([
      {
        $match: {
          role: "member",
          createdAt: {
            $gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth() - 5,
              1
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Revenue
    const paidMemberships = await Membership.find({
      paymentStatus: "paid",
    }).populate("plan");

    const totalRevenue = paidMemberships.reduce(
      (total, membership) =>
        total + (membership.plan?.price || 0),
      0
    );

    // Monthly revenue (last 6 months)
    const monthlyRevenue = await Membership.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: {
            $gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth() - 5,
              1
            ),
          },
        },
      },
      {
        $lookup: {
          from: "membershipplans",
          localField: "plan",
          foreignField: "_id",
          as: "planDetails",
        },
      },
      { $unwind: "$planDetails" },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$planDetails.price" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Membership status
    const membershipStatus = await Membership.aggregate([
      {
        $group: {
          _id: "$status",
          total: { $sum: 1 },
        },
      },
    ]);

    // Attendance by month (last 6 months)
    const monthlyAttendance = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth() - 5,
              1
            ),
          },
          status: "present",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Payment status
    const paymentStatus = await Membership.aggregate([
      {
        $group: {
          _id: "$paymentStatus",
          total: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      reports: {
        totalMembers,
        totalRevenue,
        monthlyMembers,
        monthlyRevenue,
        membershipStatus,
        monthlyAttendance,
        paymentStatus,
      },
    });
  } catch (error) {
    console.error("Reports Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate reports",
    });
  }
};