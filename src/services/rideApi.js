import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_RIDE_URL,
  credentials: "include",
});

export const rideApi = createApi({
  reducerPath: "rideApi",
  baseQuery,
  tagTypes: ["Rides", "RideDetails", "RideCategories", "RideTypes"],
  endpoints: (builder) => ({
    fetchRides: builder.query({
      query: ({ page, driverId, userId }) => {
        const params = new URLSearchParams();
        if (driverId) params.append("driver_id", driverId);
        if (userId) params.append("customer_id", userId);
        params.append("page", page);
        params.append("limit", "10");

        return `/ride/super-admin/history?${params.toString()}`;
      },
      providesTags: ["Rides"],
    }),

    fetchRideDetails: builder.query({
      query: (rideId) => `/ride/super-admin/details/${rideId}`,
      providesTags: (result, error, rideId) => [
        { type: "RideDetails", id: rideId },
      ],
    }),

    fetchRideTypes: builder.query({
      query: () => `/super-admin/ride-types`,
      providesTags: ["RideTypes"],
    }),

    fetchRideCategories: builder.query({
      query: () => `/super-admin/ride-type-categories`,
      providesTags: ["RideCategories"],
    }),

    addRideCategory: builder.mutation({
      query: (name) => ({
        url: `/super-admin/ride-type-categories`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          name,
        },
      }),
      invalidatesTags: ["RideCategories"],
    }),

    deleteRideCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/super-admin/ride-type-categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RideCategories"],
    }),

    fetchRideTypeAssignments: builder.query({
      query: (categoryId) => {
        const params = new URLSearchParams();
        if (categoryId) {
          params.append("ride_type_category", categoryId);
        }
        return `/super-admin/ride-type-assignments?${params.toString()}`;
      },
      providesTags: ["RideTypeAssignments"],
    }),

    updateRideTypeAssignments: builder.mutation({
      query: (body) => ({
        url: "/super-admin/ride-type-assignments",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }),
      invalidatesTags: ["RideTypeAssignments"],
    }),
  }),
});

export const {
  useFetchRidesQuery,
  useFetchRideDetailsQuery,
  useFetchRideTypesQuery,
  useFetchRideCategoriesQuery,
  useAddRideCategoryMutation,
  useDeleteRideCategoryMutation,
  useFetchRideTypeAssignmentsQuery,
  useUpdateRideTypeAssignmentsMutation,
} = rideApi;
