import express from 'express';
import { createOrder, getAllPurchasedCourses, isCoursePurchased, verifyPayment } from '../controllers/purchaseCourse.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.route('/createOrder').post(isAuthenticated,createOrder);
router.route('/verifyPayment').post(isAuthenticated, verifyPayment);
router.route('/course-detail/:courseId').get(isAuthenticated, isCoursePurchased)
router.route('/').get(isAuthenticated, getAllPurchasedCourses);

export default router;