const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    batchName: {
      type: String,
      required: true,
      trim: true,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lectureDate: {
      type: String,
      required: true,
    },
  },{ timestamps: true });

// Same instructor cannot have two lectures on same date
lectureSchema.index(
  { instructor: 1, lectureDate: 1 },
  { unique: true }
);

module.exports = mongoose.model("Lecture", lectureSchema);