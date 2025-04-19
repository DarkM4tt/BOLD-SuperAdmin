import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const couponApi = createApi({
  reducerPath: "couponApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_RIDE_URL}/super-admin/coupons`,
    credentials: "include",
  }),
  tagTypes: ["Coupons"],
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: () => "/all",
      providesTags: ["Coupons"],
    }),

    createCoupon: builder.mutation({
      query: (body) => ({
        url: "/create",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }),
      invalidatesTags: ["Coupons"],
    }),

    toggleStatus: builder.mutation({
      query: (couponId) => ({
        url: `/toggle-status/${couponId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Coupons"],
    }),

    updateCoupon: builder.mutation({
      query: ({ couponId, body }) => ({
        url: `/update/${couponId}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body,
      }),
      invalidatesTags: ["Coupons"],
    }),

    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupons"],
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useToggleStatusMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
