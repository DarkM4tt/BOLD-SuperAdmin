import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_ORG_URL,
  credentials: "include",
});

export const vehicleApi = createApi({
  reducerPath: "vehicleApi",
  baseQuery,
  tagTypes: ["Vehicles", "VehicleDetails"],
  endpoints: (builder) => ({
    fetchVehicles: builder.query({
      query: ({ status, page, partnerId }) => {
        const params = new URLSearchParams();
        if (partnerId) params.append("organization_id", partnerId);
        if (status) params.append("status", status);
        params.append("page", page);
        params.append("limit", "10");

        return `/organizations/super-admin/all-vehicles?${params.toString()}`;
      },
      providesTags: ["Vehicles"],
    }),

    fetchAssignedVehicles: builder.query({
      query: ({ page, partnerId }) => {
        const params = new URLSearchParams();
        if (partnerId) params.append("organization_id", partnerId);
        params.append("is_active", true);
        params.append("page", page);
        params.append("limit", "10");

        return `/organizations/super-admin/get-all-vehicle-assignments?${params.toString()}`;
      },
      providesTags: ["Vehicles"],
    }),

    fetchVehicleDetails: builder.query({
      query: (vehicleId) =>
        `/organizations/super-admin/get-vehicle-details/${vehicleId}`,
      providesTags: (result, error, vehicleId) => [
        { type: "VehicleDetails", id: vehicleId },
      ],
    }),

    updateVehicleDocStatus: builder.mutation({
      query: ({ documentId, status, remarks }) => ({
        url: `/organizations/super-admin/update-vehicle-doc-status/${documentId}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: { status, ...(remarks && { remarks }) },
      }),
      invalidatesTags: (result, error, { vehicleId }) => [
        { type: "VehicleDetails", id: vehicleId },
      ],
    }),

    updateVehicleStatus: builder.mutation({
      query: ({ vehicleId, status, remarks }) => ({
        url: `/organizations/super-admin/update-vehicle-status/${vehicleId}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: {
          status,
          ...(status === "REJECTED" &&
            remarks != null &&
            remarks && { remarks }),
        },
      }),
      invalidatesTags: (result, error, { vehicleId }) => [
        { type: "VehicleDetails", id: vehicleId },
        "Vehicles",
      ],
    }),

    assignRideCategory: builder.mutation({
      query: ({ vehicleId, type_id, type }) => ({
        url: `/organizations/super-admin/assign-vehicle-category/${vehicleId}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: {
          type_id,
          type,
        },
      }),
      invalidatesTags: (result, error, { vehicleId }) => [
        { type: "VehicleDetails", id: vehicleId },
        "Vehicles",
      ],
    }),
  }),
});

export const {
  useFetchVehicleDetailsQuery,
  useFetchAssignedVehiclesQuery,
  useFetchVehiclesQuery,
  useUpdateVehicleDocStatusMutation,
  useUpdateVehicleStatusMutation,
  useAssignRideCategoryMutation,
} = vehicleApi;
