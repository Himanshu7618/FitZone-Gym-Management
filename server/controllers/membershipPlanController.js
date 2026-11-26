import MembershipPlan from "../models/MembershipPlan.js";

// CREATE PLAN
export const createPlan = async (req, res) => {
  try {
    const {
      name,
      price,
      duration,
      durationType,
      features,
      description,
    } = req.body;

    if (!name || price === undefined || !duration) {
      return res.status(400).json({
        success: false,
        message: "Name, price and duration are required",
      });
    }

    const plan = await MembershipPlan.create({
      name,
      price,
      duration,
      durationType,
      features,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Membership plan created successfully",
      plan,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET ALL PLANS
export const getAllPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find()
      .sort({ price: 1 });

    res.status(200).json({
      success: true,
      count: plans.length,
      plans,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET ACTIVE PLANS
export const getActivePlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({
      isActive: true,
    }).sort({ price: 1 });

    res.status(200).json({
      success: true,
      count: plans.length,
      plans,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// UPDATE PLAN
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await MembershipPlan.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Membership plan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Membership plan updated successfully",
      plan,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE PLAN
export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await MembershipPlan.findByIdAndDelete(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Membership plan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Membership plan deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};