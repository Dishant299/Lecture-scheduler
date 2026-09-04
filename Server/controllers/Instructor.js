const User = require("../models/User");

exports.getAllInstructors = async (req, res) => {
    try {
        const instructors = await User.find({ accountType: 'Instructor' }).select('-password');

        res.status(200).json({
            success: true,
            message: "Instructors fetched successfully",
            instructors,
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching instructors",
        });
    }
};