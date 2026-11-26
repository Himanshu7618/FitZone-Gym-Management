
import Progress from "../models/Progress.js";
import User from "../models/User.js";

// MEMBER - ADD PROGRESS
export const addProgress = async (req, res) => {
  try {
    const { weight, height, notes, recordedAt } = req.body;

    if (
      weight === undefined ||
      height === undefined ||
      !Number.isFinite(Number(weight)) ||
      !Number.isFinite(Number(height)) ||
      Number(weight) <= 0 ||
      Number(height) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid weight and height are required",
      });
    }

    const bmi = Number(
      (Number(weight) / (Number(height) / 100) ** 2).toFixed(2)
    );

    const progress = await Progress.create({
      member: req.user._id,
      weight: Number(weight),
      height: Number(height),
      bmi,
      notes: notes || "",
      ...(recordedAt ? { recordedAt } : {}),
    });

    return res.status(201).json({
      success: true,
      message: "Progress recorded successfully",
      progress,
    });
  } catch (error) {
    console.error("Add Progress Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// MEMBER - GET OWN PROGRESS HISTORY
export const getMyProgress = async (req, res) => {
  try {
    const progress = await Progress.find({
      member: req.user._id,
    }).sort({ recordedAt: -1 });

    return res.status(200).json({
      success: true,
      count: progress.length,
      progress,
    });
  } catch (error) {
    console.error("Get My Progress Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ADMIN - GET ALL MEMBERS' PROGRESS
export const getAllProgress = async (req, res) => {
  try {
    const progress = await Progress.find()
      .populate("member", "-password")
      .sort({ recordedAt: -1 });

    return res.status(200).json({
      success: true,
      count: progress.length,
      progress,
    });
  } catch (error) {
    console.error("Get All Progress Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


 // MEMBER - UPDATE OWN PROGRESS
export const updateProgress = async (req, res) => {
  try {
    const { weight, height, notes, recordedAt } = req.body;

    const progress = await Progress.findOne({
      _id: req.params.id,
      member: req.user._id,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress record not found",
      });
    }

    if (weight !== undefined) {
      if (!Number.isFinite(Number(weight)) || Number(weight) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Weight must be a valid positive number",
        });
      }

      progress.weight = Number(weight);
    }

    if (height !== undefined) {
      if (!Number.isFinite(Number(height)) || Number(height) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Height must be a valid positive number",
        });
      }

      progress.height = Number(height);
    }

    if (notes !== undefined) {
      progress.notes = notes;
    }

    if (recordedAt !== undefined) {
      progress.recordedAt = recordedAt;
    }

    // Recalculate BMI whenever weight or height changes
    progress.bmi = Number(
      (progress.weight / (progress.height / 100) ** 2).toFixed(2)
    );

    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      progress,
    });
  } catch (error) {
    console.error("Update Progress Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


 // MEMBER - DELETE OWN PROGRESS
export const deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findOneAndDelete({
      _id: req.params.id,
      member: req.user._id,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Progress deleted successfully",
    });
  } catch (error) {
    console.error("Delete Progress Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
