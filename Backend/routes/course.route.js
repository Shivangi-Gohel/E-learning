import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { createCourse, editCourse, getCreatorCourses, getCourseById, createLecture, getCourseLecture, editLecture, removeLecture, getLectureById, togglePublishCourse, getPublishedCourses, enrollStudentToCourse, serachCourse } from '../controllers/course.controller.js';
import upload from "../utils/multer.js"

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/search").get(isAuthenticated, serachCourse);
router.route("/published-courses").get(getPublishedCourses);
router.route("/").get(isAuthenticated, getCreatorCourses);
router.route("/:courseId").put(isAuthenticated, upload.single("courseThumbnail"), editCourse)
router.route("/:courseId").get(isAuthenticated, getCourseById);
router.route("/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated, editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture)
router.route("/lecture/:lectureId").get(isAuthenticated, getLectureById);
router.route("/:courseId").patch(isAuthenticated, togglePublishCourse);
router.route("/enroll/:courseId").post(isAuthenticated, enrollStudentToCourse);



export default router;