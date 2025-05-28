import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../../constant.js";

const COURSE_API = `${API_URL}courses/`;

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
        query: ({courseTitle, category}) => ({
            url: "/",
            method: "POST",
            body: {
                courseTitle,
                category
            },
        })
    })
  })
});

export const { useCreateCourseMutation } = courseApi;