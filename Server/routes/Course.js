const express = require("express");

const router = express.Router();

const { createCourse, getAllCourses, addBatch } = require("../controllers/Course");

const { auth, isAdmin } = require("../middlewares/auth");

router.post("/",auth,isAdmin,createCourse);
router.get("/",auth,isAdmin,getAllCourses);
router.post("/:courseId/batches",auth,isAdmin,addBatch)

module.exports = router;