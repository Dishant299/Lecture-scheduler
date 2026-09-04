require("dotenv").config();

const bcrypt = require("bcryptjs");

const connectDB = require("../configs/database");
const User = require("../models/User");

const seedUsers = async () => {
  try {
    await connectDB();

    await User.deleteMany({});

    const adminPassword = await bcrypt.hash("Admin@123",10);

    const instructorPassword = await bcrypt.hash("Rahul@123",10);

    const admin = await User.create({
        firstname: "System",
        lastname: "Admin",
        email: "admin@ideamagix.test",
        password: adminPassword,
        accountType: "Admin",
    });

    const instructor = await User.create({
        firstname: "Rahul",
        lastname: "Sharma",
        email: "rahul@ideamagix.test",
        password: instructorPassword,
        accountType: "Instructor",
    });

    console.log("Users created successfully");
    console.log("Admin:", admin.email);
    console.log("Instructor:", instructor.email);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedUsers();