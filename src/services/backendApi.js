import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://raigarvivah.com/api",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 1 });

export const backendApi = createApi({
  reducerPath: "backendApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["User"],

  endpoints: (builder) => ({
    // 🔐 REGISTER
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    // 🔐 LOGIN
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    // 👤 BASIC DETAILS
    updateBasicDetails: builder.mutation({
      query: (data) => ({
        url: "/basic-details/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // 🛕 RELIGION DETAILS
    updateReligionDetails: builder.mutation({
      query: (data) => ({
        url: "/religion-details/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // 🧑 PERSONAL DETAILS
    updatePersonalDetails: builder.mutation({
      query: (data) => ({
        url: "/personal-details/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // 💼 PROFESSIONAL DETAILS
    updateProfessionalDetails: builder.mutation({
      query: (data) => ({
        url: "/professional-details/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // 📝 ABOUT YOURSELF
    updateAboutYourself: builder.mutation({
      query: (formData) => ({
        url: "/about-yourself/update",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    // 🔐 ADMIN LOGIN
    adminLogin: builder.mutation({
      query: (data) => ({
        url: "/admin/login",
        method: "POST",
        body: data,
      }),
    }),

    // 👥 GET ALL USERS
    getAllUsers: builder.query({
      query: () => "/users/list",
      providesTags: ["User"],
    }),

    // 👤 GET USER BY ID
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
    }),

    // ✅ APPROVE USER
    approveUser: builder.mutation({
      query: ({ id, remark }) => ({
        url: `/admin/user/${id}/approve`,
        method: "PUT",
        body: { reviewRemark: remark },
      }),
      invalidatesTags: ["User"],
    }),

    // ❌ REJECT USER
    rejectUser: builder.mutation({
      query: ({ id, remark }) => ({
        url: `/admin/user/${id}/reject`,
        method: "PUT",
        body: { reviewRemark: remark },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useUpdateBasicDetailsMutation,
  useUpdateReligionDetailsMutation,
  useUpdatePersonalDetailsMutation,
  useUpdateProfessionalDetailsMutation,
  useUpdateAboutYourselfMutation,
  useAdminLoginMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useApproveUserMutation,
  useRejectUserMutation,
} = backendApi;
