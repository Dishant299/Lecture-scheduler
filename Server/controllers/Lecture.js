const Lecture = require("../models/Lecture");
const Course = require("../models/Course");
const User = require("../models/User");

exports.createLecture = async (req, res) => {
  try {
    const { courseId, batchName, instructorId, lectureDate } = req.body;

    if ( !courseId || !batchName || !instructorId || !lectureDate ) {
      return res.status(400).json({
        success: false,
        message: "All lecture fields are required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const instructor = await User.findOne({
      _id: instructorId,
      accountType: "Instructor",
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    const lecture = await Lecture.create({
      course: courseId,
      batchName,
      instructor: instructorId,
      lectureDate,
    });

    return res.status(201).json({
      success: true,
      message: "Lecture scheduled successfully",
      lecture,
    });
  } catch (error) {
    // MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This instructor already has a lecture scheduled on this date",
      });
    }

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Unable to schedule lecture",
    });
  }
};

exports.getAllLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find()
      .populate("course", "name")
      .populate("instructor", "firstname lastname email")
      .sort({ lectureDate: 1 });

    return res.status(200).json({
      success: true,
      lectures,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch lectures",
    });
  }
};

exports.getMyLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({
      instructor: req.user.id,
    })
      .populate("course", "name image level")
      .populate("instructor", "firstname lastname email")
      .sort({ lectureDate: 1 });

    return res.status(200).json({
      success: true,
      lectures,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your lectures",
    });
  }
};