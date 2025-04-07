import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_RIDE_URL,
  credentials: "include",
});

export const rideApi = createApi({
  reducerPath: "rideApi",
  baseQuery,
  tagTypes: ["Rides", "RideDetails", "RideTypes"],
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
  }),
});

export const {
  useFetchRidesQuery,
  useFetchRideDetailsQuery,
  useFetchRideTypesQuery,
} = rideApi;
