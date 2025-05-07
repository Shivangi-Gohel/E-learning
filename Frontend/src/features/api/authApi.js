import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../../constant.js';
import { userLoggedIn } from '../authSlice.js';

const USER_API = `${API_URL}users/`;

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: USER_API,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (inputData) => ({
                url: 'register',
                method: 'POST',
                body: inputData,
            })
        }),
        loginUser: builder.mutation({
            query: (inputData) => ({
                url: 'login',
                method: 'POST',
                body: inputData,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(userLoggedIn(data));
                } catch (err) {
                    console.log(err);
                }
            }
        }),  
        loadUser: builder.query({
            query: () => ({
                url: 'profile',
                method: 'GET',
                credentials: 'include',
            })
        })  
    })
});

export const { useRegisterUserMutation, useLoginUserMutation, useLoadUserQuery } = authApi;