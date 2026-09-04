const express = require("express");

const router = express.Router();

const { createLecture, getAllLectures ,getMyLectures,} = require("../controllers/Lecture");
const { isInstructor } = require("../middlewares/auth");
const { auth, isAdmin } = require("../middlewares/auth");

router.post("/",auth,isAdmin,createLecture);
router.get("/",auth,isAdmin,getAllLectures);
router.get("/my-lectures",auth,isInstructor,getMyLectures);

module.exports = router;