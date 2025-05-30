import { Course } from "../models/course.model.js";
import {deleteMediaFromCloudinary, uploadMedia} from "../utils/cloudinary.js";

const createCourse = async (req, res) => {
    try {
        const {courseTitle, category} = req.body
        if(!courseTitle || !category) {
            return res.status(400)
            .json({
                success: false,
                message: "Course title and category are required"
            })
        }
        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id
        });

        return res.status(201)
        .json({
            success: true,
            message: "Course created successfully",
            course
        })
    } catch (error) {
        console.log(error);
        return res.status(500)
        .json({
            success: false,
            message: "Internal server error"
        });
    }
}

const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({creator: userId});
        if(!courses || courses.length === 0) {
            return res.status(404)
            .json({
                courses: [],
                success: false,
                message: "No courses found for this user"
            });
        }
        return res.status(200)
        .json({
            success: true,
            message: "Courses fetched successfully",
            courses
        });
    } catch (error) {
        console.log(error);
        return res.status(500)
        .json({
            success: false,
            message: "Internal server error"
        });
    }
}

const editCourse = async (req, res) => {
    try {
        const {courseId} = req.params;
        const {courseTitle, subTitle, description, category, courseLevel, coursePrice} = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);
        if(!course) {
            return res.status(404)
            .json({
                success: false,
                message: "Course not found"
            });
        }
        let courseThumbnail;
        if(thumbnail) {
            if(course.courseThumbnail) {
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId); //delete old thumbnail
            }
            // upload new thumbnail
            courseThumbnail = await uploadMedia(thumbnail.path);
        }

        const updateData = {
            courseTitle,
            subTitle,
            description,
            category,
            courseLevel,
            coursePrice,
            courseThumbnail: courseThumbnail?.secure_url
        }

        course = await Course.findByIdAndUpdate(courseId, updateData, {new: true});

        return res.status(200)
        .json({
            success: true,
            message: "Course updated",
            course
        });
    } catch (error) {
        console.log(error);
        return res.status(500)
        .json({
            success: false,
            message: "Internal server error"
        });
    }
}

const getCourseById = async (req, res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId);
        if(!course) {
            return res.status(404)
            .json({
                success: false,
                message: "Course not found"
            });
        }
        return res.status(200)
        .json({
            success: true,
            message: "Course fetched successfully",
            course
        });
    } catch (error) {
        console.log(error);
        return res.status(500)
        .json({
            success: false,
            message: "Internal server error"
        });
    }
}

export {createCourse, getCreatorCourses, editCourse, getCourseById};