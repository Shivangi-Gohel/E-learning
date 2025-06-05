import { createRazorpayInstance } from "../config/razorpay.config.js";
import {Course} from "../models/course.model.js";

const createOrder = async (req, res) => {
  try {
    // take courseId from database
    const {courseId} = req.body;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }
    // find course in database
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    // create order with razorpay
    const razorpay = createRazorpayInstance();
    const options = {
      amount: course.price * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_${courseId}`,
      notes: {
        courseId: course._id.toString(),
        courseName: course.name
      }
    };
    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({
        success: false,
        message: "Failed to create order"
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

const verifyPayment = async (req, res) => {
  try {
    const {razorpayOrderId, razorpayPaymentId, razorpaySignature} = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "All payment details are required"
      });
    }

    // Verify the payment signature
    const razorpay = createRazorpayInstance();
    const isValidSignature = razorpay.utils.verifyPaymentSignature({
      order_id: razorpayOrderId,
      payment_id: razorpayPaymentId,
      signature: razorpaySignature
    });

    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    // Payment is valid, proceed with further actions like updating the database

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export {createOrder, verifyPayment}