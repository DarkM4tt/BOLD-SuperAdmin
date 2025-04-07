import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_AUTH_URL,
  credentials: "include",
});

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["Users", "UserDetails"],
  endpoints: (builder) => ({
    fetchUsers: builder.query({
      query: ({ page }) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", "10");

        return `/super-admin/all-customers?${params.toString()}`;
      },
      providesTags: ["Users"],
    }),

    fetchUserDetails: builder.query({
      query: (userId) => `/super-admin/customer-details/${userId}`,
      providesTags: (result, error, userId) => [
        { type: "UserDetails", id: userId },
      ],
    }),
  }),
});

export const { useFetchUsersQuery, useFetchUserDetailsQuery } = userApi;
