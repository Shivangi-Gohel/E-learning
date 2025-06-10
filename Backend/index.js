import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config({});

connectDB();   
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

import userRoute from './routes/user.route.js';
app.use("/api/v1/users", userRoute);

import courseRoute from './routes/course.route.js';
app.use("/api/v1/courses", courseRoute);

import mediaRoute from './routes/media.route.js';
app.use("/api/v1/media", mediaRoute);

import purchaseCourseRoute from './routes/purchaseCourse.route.js';
app.use("/api/v1/purchase", purchaseCourseRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});