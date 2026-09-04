const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        enum: ['Admin', 'Instructor'],
        required: true,
    },
    image: {
      type: String,
      default: "",
    },
 
},{timestamps: true});

module.exports = mongoose.model('User', userSchema);