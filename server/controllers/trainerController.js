import Trainer from "../models/Trainer.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// CREATE TRAINER
export const createTrainer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      specialization,
      experience,
      salary,
      bio,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !specialization
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone, password and specialization are required",
      });
    }

    // Check user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "trainer",
    });

    // Create trainer profile
    const trainer = await Trainer.create({
      user: user._id,
      specialization,
      experience: experience || 0,
      salary: salary || 0,
      bio: bio || "",
    });

    const populatedTrainer = await Trainer.findById(trainer._id).populate(
      "user",
      "-password"
    );

    res.status(201).json({
      success: true,
      message: "Trainer created successfully",
      trainer: populatedTrainer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET ALL TRAINERS
export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .populate("user", "-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trainers.length,
      trainers,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET SINGLE TRAINER
export const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id).populate(
      "user",
      "-password"
    );

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    res.status(200).json({
      success: true,
      trainer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// UPDATE TRAINER
export const updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    const {
      name,
      email,
      phone,
      specialization,
      experience,
      salary,
      status,
      bio,
    } = req.body;

    // Update trainer user information
    const user = await User.findById(trainer.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Trainer user not found",
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();

    // Update trainer information
    if (specialization) {
      trainer.specialization = specialization;
    }

    if (experience !== undefined) {
      trainer.experience = experience;
    }

    if (salary !== undefined) {
      trainer.salary = salary;
    }

    if (status) {
      trainer.status = status;
    }

    if (bio !== undefined) {
      trainer.bio = bio;
    }

    await trainer.save();

    const updatedTrainer = await Trainer.findById(trainer._id).populate(
      "user",
      "-password"
    );

    res.status(200).json({
      success: true,
      message: "Trainer updated successfully",
      trainer: updatedTrainer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE TRAINER
export const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    // Delete trainer profile
    await Trainer.findByIdAndDelete(req.params.id);

    // Delete associated user
    await User.findByIdAndDelete(trainer.user);

    res.status(200).json({
      success: true,
      message: "Trainer deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// TRAINER PROFILE
export const getMyTrainerProfile = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({
      user: req.user._id,
    }).populate("user", "-password");

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer profile not found",
      });
    }

    res.status(200).json({
      success: true,
      trainer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// TRAINER - Get Active Members for Diet Plans
export const getActiveMembers = async (req, res) => {
  try {
    const members = await User.find({
      role: "member",
      status: "active",
    })
      .select("name email phone")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error("Get Active Members Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};