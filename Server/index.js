const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./configs/database');
const userRoutes = require('./routes/User');
const instructorRoutes = require('./routes/Instructor');
const courseRoutes = require('./routes/Course');
const lectureRoutes = require('./routes/Lecture');
require('dotenv').config();

const app = express();

connectDB();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Lecture Scheduler Server is running",
  });
});

const PORT = process.env.PORT || 4000;

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/instructors', instructorRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/lectures', lectureRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});