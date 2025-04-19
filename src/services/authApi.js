import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_ORG_URL,
  credentials: "include",
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/organizations/super-admin/login",
        method: "POST",
        body: credentials,
      }),
    }),
    checkSession: builder.query({
      query: () => "/organizations/super-admin/me",
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/organizations/super-admin/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useCheckSessionQuery, useLogoutMutation } =
  authApi;
