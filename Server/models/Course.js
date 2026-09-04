const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    level:{
        type: String,
        required: true,
        enum: ["Beginner", "Intermediate", "Advanced"],
    },
    description:{
        type: String,
        required: true,
        trim: true,
    },
    image:{
        type: String,
        default: "",
    },
    batches:[
        {
            name:{
                type: String,
                required: true,
                trim: true,
            },
        },
    ]
},{timestamps: true});

module.exports = mongoose.model("Course", courseSchema);