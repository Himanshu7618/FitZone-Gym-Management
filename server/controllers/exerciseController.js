import Exercise from "../models/Exercise.js";

// CREATE EXERCISE
export const createExercise = async (req, res) => {
  try {
    const {
      name,
      category,
      muscleGroup,
      description,
      instructions,
      difficulty,
      equipment,
    } = req.body;

    if (!name || !category || !muscleGroup) {
      return res.status(400).json({
        success: false,
        message: "Name, category and muscle group are required",
      });
    }

    const existingExercise = await Exercise.findOne({
      name: name.trim(),
    });

    if (existingExercise) {
      return res.status(400).json({
        success: false,
        message: "Exercise already exists",
      });
    }

    const exercise = await Exercise.create({
      name,
      category,
      muscleGroup,
      description: description || "",
      instructions: instructions || "",
      difficulty: difficulty || "beginner",
      equipment: equipment || "None",
    });

    res.status(201).json({
      success: true,
      message: "Exercise created successfully",
      exercise,
    });
  } catch (error) {
    console.error("Create Exercise Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET ALL EXERCISES
export const getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: exercises.length,
      exercises,
    });
  } catch (error) {
    console.error("Get Exercises Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET SINGLE EXERCISE
export const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    res.status(200).json({
      success: true,
      exercise,
    });
  } catch (error) {
    console.error("Get Exercise Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// UPDATE EXERCISE
export const updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    const {
      name,
      category,
      muscleGroup,
      description,
      instructions,
      difficulty,
      equipment,
      isActive,
    } = req.body;

    if (name !== undefined) exercise.name = name;
    if (category !== undefined) exercise.category = category;
    if (muscleGroup !== undefined) exercise.muscleGroup = muscleGroup;
    if (description !== undefined) exercise.description = description;
    if (instructions !== undefined) exercise.instructions = instructions;
    if (difficulty !== undefined) exercise.difficulty = difficulty;
    if (equipment !== undefined) exercise.equipment = equipment;
    if (isActive !== undefined) exercise.isActive = isActive;

    await exercise.save();

    res.status(200).json({
      success: true,
      message: "Exercise updated successfully",
      exercise,
    });
  } catch (error) {
    console.error("Update Exercise Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// DELETE EXERCISE
export const deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    await Exercise.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Exercise deleted successfully",
    });
  } catch (error) {
    console.error("Delete Exercise Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};