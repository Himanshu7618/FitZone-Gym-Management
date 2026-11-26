import Workout from "../models/Workout.js";
import User from "../models/User.js";
import Exercise from "../models/Exercise.js";

// CREATE WORKOUT
export const createWorkout = async (req, res) => {
  try {
    const {
      memberId,
      name,
      description,
      exercises,
      startDate,
      endDate,
    } = req.body;

    // Basic validation
    if (!memberId || !name || !exercises || exercises.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Member, workout name and exercises are required",
      });
    }

    // Check member
    const member = await User.findOne({
      _id: memberId,
      role: "member",
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Check every exercise
    for (const item of exercises) {
      const exercise = await Exercise.findById(item.exercise);

      if (!exercise || !exercise.isActive) {
        return res.status(400).json({
          success: false,
          message: `Invalid or inactive exercise: ${item.exercise}`,
        });
      }
    }

    // Create workout
    const workout = await Workout.create({
      member: memberId,
      trainer: req.user._id,
      name,
      description: description || "",
      exercises,
      startDate: startDate || new Date(),
      endDate: endDate || null,
    });

    // Populate response
    const populatedWorkout = await Workout.findById(workout._id)
      .populate("member", "-password")
      .populate("trainer", "-password")
      .populate("exercises.exercise");

    res.status(201).json({
      success: true,
      message: "Workout created successfully",
      workout: populatedWorkout,
    });
  } catch (error) {
    console.error("Create Workout Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// TRAINER - GET OWN WORKOUTS
export const getTrainerWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({
      trainer: req.user._id,
    })
      .populate("member", "-password")
      .populate("exercises.exercise")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: workouts.length,
      workouts,
    });
  } catch (error) {
    console.error("Get Trainer Workouts Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// MEMBER - GET MY WORKOUTS
export const getMyWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({
      member: req.user._id,
    })
      .populate("trainer", "-password")
      .populate("exercises.exercise")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: workouts.length,
      workouts,
    });
  } catch (error) {
    console.error("Get My Workouts Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ADMIN - GET ALL WORKOUTS
export const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find()
      .populate("member", "-password")
      .populate("trainer", "-password")
      .populate("exercises.exercise")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: workouts.length,
      workouts,
    });
  } catch (error) {
    console.error("Get All Workouts Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET SINGLE WORKOUT
export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id)
      .populate("member", "-password")
      .populate("trainer", "-password")
      .populate("exercises.exercise");

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
      });
    }

    res.status(200).json({
      success: true,
      workout,
    });
  } catch (error) {
    console.error("Get Workout Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// UPDATE WORKOUT
export const updateWorkout = async (req, res) => {
  try {
    console.log("UPDATE WORKOUT HIT:", req.user.role, req.body);
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
      });
    }
    if (
      req.user.role === "trainer" &&
      workout.trainer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own workouts",
      });
    }

    if (
      req.user.role === "member" &&
      workout.member.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own workouts",
      });
    }

    const {
      name,
      description,
      exercises,
      startDate,
      endDate,
      status,
    } = req.body;

    // MEMBER: Only allow completing their own workout

    if (req.user.role === "member") {
      if (status !== "completed") {
        return res.status(400).json({
          success: false,
          message: "Members can only mark workouts as completed",
        });
      }

      workout.status = "completed";
    }

    if (name !== undefined) workout.name = name;
    if (description !== undefined) workout.description = description;
    if (exercises !== undefined) workout.exercises = exercises;
    if (startDate !== undefined) workout.startDate = startDate;
    if (endDate !== undefined) workout.endDate = endDate;
    if (status !== undefined) workout.status = status;

    await workout.save();
    // console.log("SAVED WORKOUT STATUS:", workout.status);
    const updatedWorkout = await Workout.findById(workout._id)
      .populate("member", "-password")
      .populate("trainer", "-password")
      .populate("exercises.exercise");
    // console.log("DATABASE STATUS:", updatedWorkout.status);
    res.status(200).json({
      success: true,
      message: "Workout updated successfully",
      workout: updatedWorkout,
    });
  } catch (error) {
    console.error("Update Workout Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// DELETE WORKOUT
export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
      });
    }
    if (
      req.user.role === "trainer" &&
      workout.trainer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own workouts",
      });
    }

    await Workout.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Workout deleted successfully",
    });
  } catch (error) {
    console.error("Delete Workout Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};