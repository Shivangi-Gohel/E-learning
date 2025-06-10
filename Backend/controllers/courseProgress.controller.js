import { Course } from "../models/course.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";

const getCourseProgress = async (req, res) => {
    try {
        const {courseId} = req.params;
        const userId = req.id;

        // step-1 fetch the user course progress
        let courseProgress = await CourseProgress.findOne({ courseId, userId }).populate("courseId");

        const courseDetails = await Course.findById(courseId);

        if(!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // step-2 If no progress found, return course details with an empty progress array
        if(!courseProgress) {
            res.status(200).json({
                data: {
                    courseDetails,
                    progress: [],
                    completed: false
                }
            });
        }

        // step-3 Return the users course progress along with course details
        res.status(200).json({
            data: {
                courseDetails,
                progress: courseProgress.LectureProgress,
                completed: courseProgress.completed
            }
        });

    } catch (error) {
        console.log(error);
    }
}

const updateLectureProgress = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const userId = req.id;

        // fetch or create course progress
        let courseProgress = await CourseProgress.findOne({ courseId, userId });

        if(!courseProgress) {
            // If no progress found, create a new one
            courseProgress = new CourseProgress({
                userId,
                courseId,
                completed: false,
                LectureProgress: []
            })
        }

        // find the lecture progress in the course progress
        const lectureIndex = courseProgress.LectureProgress.findIndex(lecture => lecture.lectureId === lectureId);
        if(lectureIndex === -1) {
            // If lecture not found, add it
            courseProgress.LectureProgress.push({
                lectureId,
                viewed: true
            });
        } else {
            // If lecture found, update its viewed status
            courseProgress.LectureProgress[lectureIndex].viewed = true;
        }

        // Check if all lectures are viewed
        const LectureProgressLength = courseProgress.LectureProgress.filter((lectureProg) => lectureProg.viewed).length;

        const course = await Course.findById(courseId);

        if(course.lectures.length === LectureProgressLength) {
            courseProgress.completed = true;
        }

        await courseProgress.save();

        return res.status(200).json({
            success: true,
            message: "Lecture progress updated successfully",
        });
    } catch (error) {
        console.log(error);
    }
}

export {getCourseProgress, updateLectureProgress};