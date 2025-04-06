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
      query: ({ page, driverId }) => {
        const params = new URLSearchParams();
        if (driverId) params.append("driver_id", driverId);
        params.append("page", page);
        params.append("limit", "10");

        return `/ride/super-admin/history?${params.toString()}`;
      },
      providesTags: ["Rides"],
    }),

    fetchRideDetails: builder.query({
      query: (driverId) => `/super-admin/driver-details/${driverId}`,
      providesTags: (result, error, driverId) => [
        { type: "RideDetails", id: driverId },
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
