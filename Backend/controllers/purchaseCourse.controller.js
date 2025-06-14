import { createRazorpayInstance } from "../config/razorpay.config.js";
import { Course } from "../models/course.model.js";
import crypto from "crypto";
import { PurchaseCourse } from "../models/purchaseCourse.model.js";
import { log } from "console";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
dotenv.config();

const createOrder = async (req, res) => {
  try {
    // take courseId from database
    const userId = req.id;
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }
    // find course in database
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const razorpay = createRazorpayInstance();
    const options = {
      amount: course.coursePrice * 100,
      currency: "INR",
      receipt: `receipt_${courseId}`,
    };
    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({
        success: false,
        message: "Failed to create order",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    console.log("Verifying payment with body:", req.body);

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, courseId } =
      req.body;
    const userId = req.id;

    if (!razorpayPaymentId || !courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID, Course ID, and User ID are required",
      });
    }

    console.log("Signature verification skipped in development");

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const newPurchase = new PurchaseCourse({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "completed",
      paymentId: razorpayPaymentId,
    });

    await newPurchase.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId },
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified (mocked in test mode)",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const isCoursePurchased = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;

    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Course ID are required",
      });
    }

    const existing = await PurchaseCourse.findOne({ userId, courseId });

    return res.status(200).json({
      success: true,
      isPurchased: !!existing,
    });
  } catch (error) {
    console.error("Error checking course purchase: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// const getAllPurchasedCourses = async (req, res) => {
//   try {
//     const userId = req.id;
//     console.log("Fetching purchased courses for user ID:", userId);

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "User ID is required",
//       });
//     }

//     const purchases = await PurchaseCourse.find({ userId }).populate(
//       "courseId"
//     );

//     console.log("Fetched purchases: ", purchases);

//     return res.status(200).json({
//       success: true,
//       purchases,
//     });
//   } catch (error) {
//     console.error("Error fetching purchased courses: ", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

const getAllPurchasedCourses = async (_, res) => {
  try {
    const purchasedCourse = await PurchaseCourse.find({
      status: "completed",
    }).populate("courseId");
    if (!purchasedCourse) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }
    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  createOrder,
  verifyPayment,
  isCoursePurchased,
  getAllPurchasedCourses,
};
