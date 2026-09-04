const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config();

exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, accountType: user.accountType },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                accountType: user.accountType,
                image: user.image,
            },
        });
    }catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong",
        });
    }
    
}
