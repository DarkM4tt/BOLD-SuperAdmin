import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_AUTH_URL,
  credentials: "include",
});

export const driverApi = createApi({
  reducerPath: "driverApi",
  baseQuery,
  tagTypes: ["Drivers", "DriverDetails"],
  endpoints: (builder) => ({
    fetchDrivers: builder.query({
      query: ({ status, is_vehicle, page, partnerId }) => {
        const params = new URLSearchParams();
        if (partnerId) params.append("organization_id", partnerId);
        if (status) params.append("status", status);
        if (typeof is_vehicle === "boolean")
          params.append("is_vehicle", is_vehicle);
        params.append("page", page);
        params.append("limit", "10");

        return `/super-admin/all-drivers?${params.toString()}`;
      },
      providesTags: ["Drivers"],
    }),

    fetchDriverDetails: builder.query({
      query: (driverId) => `/super-admin/driver-details/${driverId}`,
      providesTags: (result, error, driverId) => [
        { type: "DriverDetails", id: driverId },
      ],
    }),

    updateDriverDocStatus: builder.mutation({
      query: ({ documentId, status, remarks }) => ({
        url: `/super-admin/update-driver-doc-status/${documentId}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: { status, ...(remarks && { remarks }) },
      }),
      invalidatesTags: (result, error, { driverId }) => [
        { type: "DriverDetails", id: driverId },
      ],
    }),

    updateDriverStatus: builder.mutation({
      query: ({ driverId, status }) => ({
        url: `/super-admin/update-driver-status/${driverId}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: { status },
      }),
      invalidatesTags: (result, error, { driverId }) => [
        { type: "DriverDetails", id: driverId },
        "Drivers",
      ],
    }),
  }),
});

export const {
  useFetchDriversQuery,
  useFetchDriverDetailsQuery,
  useUpdateDriverStatusMutation,
  useUpdateDriverDocStatusMutation,
} = driverApi;
