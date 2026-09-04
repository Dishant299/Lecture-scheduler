const express = require("express");

const router = express.Router();

const { getAllInstructors } = require("../controllers/Instructor");

const { auth, isAdmin } = require("../middlewares/auth");

router.get("/",auth,isAdmin,getAllInstructors);

module.exports = router;