import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_ORG_URL,
  credentials: "include",
});

export const organizationApi = createApi({
  reducerPath: "organizationApi",
  baseQuery,
  endpoints: (builder) => ({
    fetchOrganizations: builder.query({
      query: ({ status, page }) => {
        const params = new URLSearchParams({
          status: status || "",
          page,
          limit: 10,
        }).toString();

        return `/organizations/super-admin/all-organizations?${params}`;
      },
    }),
  }),
});

export const { useFetchOrganizationsQuery } = organizationApi;
