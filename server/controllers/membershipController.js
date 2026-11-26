import Membership from "../models/Membership.js";
import User from "../models/User.js";
import MembershipPlan from "../models/MembershipPlan.js";

// CREATE MEMBERSHIP
export const createMembership = async (req, res) => {
  try {
    const {
      userId,
      planId,
      startDate,
      paymentStatus,
      paymentMethod,
    } = req.body;

    if (!userId || !planId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Plan ID are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const plan = await MembershipPlan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Membership plan not found",
      });
    }

    if (!plan.isActive) {
      return res.status(400).json({
        success: false,
        message: "Membership plan is inactive",
      });
    }

    const existingMembership = await Membership.findOne({
      user: userId,
      status: "active",
    });

    if (existingMembership) {
      return res.status(400).json({
        success: false,
        message: "User already has an active membership",
      });
    }

    const membershipStartDate = startDate
      ? new Date(startDate)
      : new Date();

    const membershipEndDate = new Date(membershipStartDate);

    if (plan.durationType === "days") {
      membershipEndDate.setDate(
        membershipEndDate.getDate() + plan.duration
      );
    } else if (plan.durationType === "months") {
      membershipEndDate.setMonth(
        membershipEndDate.getMonth() + plan.duration
      );
    } else if (plan.durationType === "years") {
      membershipEndDate.setFullYear(
        membershipEndDate.getFullYear() + plan.duration
      );
    }

    const membership = await Membership.create({
      user: userId,
      plan: planId,
      startDate: membershipStartDate,
      endDate: membershipEndDate,
      paymentStatus: paymentStatus || "pending",
      paymentMethod: paymentMethod || "cash",
    });

    const populatedMembership = await Membership.findById(
      membership._id
    )
      .populate("user", "-password")
      .populate("plan");

    res.status(201).json({
      success: true,
      message: "Membership created successfully",
      membership: populatedMembership,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET MY MEMBERSHIP
export const getMyMembership = async (req, res) => {
  try {
    const memberships = await Membership.find({
      user: req.user._id,
    })
      .populate("plan")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: memberships.length,
      memberships,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET ALL MEMBERSHIPS - ADMIN
export const getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find()
      .populate("user", "-password")
      .populate("plan")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: memberships.length,
      memberships,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// UPDATE MEMBERSHIP STATUS
export const updateMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, paymentMethod } = req.body;

    const membership = await Membership.findById(id);

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found",
      });
    }

    if (status) {
      membership.status = status;
    }

    if (paymentStatus) {
      membership.paymentStatus = paymentStatus;
    }

    if (paymentMethod) {
      membership.paymentMethod = paymentMethod;
    }

    await membership.save();

    const updatedMembership = await Membership.findById(id)
      .populate("user", "-password")
      .populate("plan");

    res.status(200).json({
      success: true,
      message: "Membership updated successfully",
      membership: updatedMembership,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};