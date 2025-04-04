import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_ORG_URL,
  credentials: "include",
});

export const organizationApi = createApi({
  reducerPath: "organizationApi",
  baseQuery,
  tagTypes: ["Organizations", "PartnerDetails"],
  endpoints: (builder) => ({
    fetchOrganizations: builder.query({
      query: ({ status, is_completed, page }) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (typeof is_completed === "boolean")
          params.append("is_completed", is_completed);
        params.append("page", page);
        params.append("limit", "10");

        return `/organizations/super-admin/all-organizations?${params.toString()}`;
      },
      providesTags: ["Organizations"],
    }),

    fetchOrganizationDetails: builder.query({
      query: (orgId) =>
        `/organizations/super-admin/get-organization-details/${orgId}`,
      providesTags: (result, error, orgId) => [
        { type: "PartnerDetails", id: orgId },
      ],
    }),

    updateOrgDocStatus: builder.mutation({
      query: ({ documentId, status, remarks }) => ({
        url: `/organizations/super-admin/update-org-doc-status/${documentId}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: { status, ...(remarks && { remarks }) },
      }),
      invalidatesTags: (result, error, { orgId }) => [
        { type: "PartnerDetails", id: orgId },
      ],
    }),

    updateOrgStatus: builder.mutation({
      query: ({ orgId, status }) => ({
        url: `/organizations/super-admin/update-organization-status/${orgId}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: { status },
      }),
      invalidatesTags: (result, error, { orgId }) => [
        { type: "PartnerDetails", id: orgId },
      ],
    }),
  }),
});

export const {
  useFetchOrganizationsQuery,
  useFetchOrganizationDetailsQuery,
  useUpdateOrgDocStatusMutation,
  useUpdateOrgStatusMutation,
} = organizationApi;
