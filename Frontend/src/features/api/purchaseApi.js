import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../../constant.js";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}purchase/`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: ({ courseId, price }) => ({
        url: "createOrder",
        method: "POST",
        body: { courseId, price: price * 100 },
      }),
    }),
    verifyPayment: builder.mutation({
      query: ({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        courseId,
      }) => ({
        url: "verifyPayment",
        method: "POST",
        body: {
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          courseId,
        },
      }),
    }),
    checkIfPurchased: builder.query({
      query: (courseId) => ({
        url: `course-detail/${courseId}`,
        method: "GET",
      }),
    }),
    getPurchsedCourses: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useCheckIfPurchasedQuery,
  useGetPurchsedCoursesQuery,
} = purchaseApi;