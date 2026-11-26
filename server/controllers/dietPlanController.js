
import DietPlan from "../models/DietPlan.js";
import User from "../models/User.js";

// CREATE DIET PLAN - Trainer
export const createDietPlan = async (req, res) => {
  try {
    const {
      memberId,
      name,
      description,
      meals,
      startDate,
      endDate,
    } = req.body;

    if (
      !memberId ||
      !name ||
      !Array.isArray(meals) ||
      meals.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Member, plan name and meals are required",
      });
    }

    const member = await User.findOne({
      _id: memberId,
      role: "member",
      status: "active",
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Active member not found",
      });
    }

    const dietPlan = await DietPlan.create({
      member: memberId,
      trainer: req.user._id,
      name,
      description: description || "",
      meals,
      startDate: startDate || new Date(),
      endDate: endDate || null,
    });

    const populatedPlan = await DietPlan.findById(dietPlan._id)
      .populate("member", "-password")
      .populate("trainer", "-password");

    return res.status(201).json({
      success: true,
      message: "Diet plan created successfully",
      dietPlan: populatedPlan,
    });
  } catch (error) {
    console.error("Create Diet Plan Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// TRAINER - GET OWN DIET PLANS
export const getTrainerDietPlans = async (req, res) => {
  try {
    const dietPlans = await DietPlan.find({
      trainer: req.user._id,
    })
      .populate("member", "-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: dietPlans.length,
      dietPlans,
    });
  } catch (error) {
    console.error("Get Trainer Diet Plans Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// MEMBER - GET MY DIET PLANS
export const getMyDietPlans = async (req, res) => {
  try {
    const dietPlans = await DietPlan.find({
      member: req.user._id,
    })
      .populate("trainer", "-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: dietPlans.length,
      dietPlans,
    });
  } catch (error) {
    console.error("Get My Diet Plans Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ADMIN - GET ALL DIET PLANS
export const getAllDietPlans = async (req, res) => {
  try {
    const dietPlans = await DietPlan.find()
      .populate("member", "-password")
      .populate("trainer", "-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: dietPlans.length,
      dietPlans,
    });
  } catch (error) {
    console.error("Get All Diet Plans Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


 // TRAINER - UPDATE OWN DIET PLAN
export const updateDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findOne({
      _id: req.params.id,
      trainer: req.user._id,
    });

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: "Diet plan not found or access denied",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "meals",
      "startDate",
      "endDate",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        dietPlan[field] = req.body[field];
      }
    });

    await dietPlan.save();

    const updatedPlan = await DietPlan.findById(dietPlan._id)
      .populate("member", "-password")
      .populate("trainer", "-password");

    return res.status(200).json({
      success: true,
      message: "Diet plan updated successfully",
      dietPlan: updatedPlan,
    });
  } catch (error) {
    console.error("Update Diet Plan Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


 // TRAINER - DELETE OWN DIET PLAN
export const deleteDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findOneAndDelete({
      _id: req.params.id,
      trainer: req.user._id,
    });

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: "Diet plan not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Diet plan deleted successfully",
    });
  } catch (error) {
    console.error("Delete Diet Plan Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
