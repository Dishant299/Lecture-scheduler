const Course = require("../models/Course");

exports.createCourse = async (req, res) => {
  try {
    const { name, level, description, image } = req.body;

    if (!name || !level || !description || !image) {
      return res.status(400).json({
        success: false,
        message: "All course fields are required",
      });
    }

    const course = await Course.create({
      name,
      level,
      description,
      image,
      batches: [],
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Unable to create course",
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch courses",
    });
  }
};

exports.addBatch = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Batch name is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    course.batches.push({ name });

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Batch added successfully",
      course,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Unable to add batch",
    });
  }
};