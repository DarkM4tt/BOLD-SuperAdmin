import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_RIDE_URL,
  credentials: "include",
});

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery,
  tagTypes: [
    "Countries",
    "Cities",
    "Zones",
    "CountryDetails",
    "CityDetails",
    "ZoneDetails",
  ],
  endpoints: (builder) => ({
    fetchCities: builder.query({
      query: ({ page }) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", "10");

        return `/super-admin/city/get-cities?${params.toString()}`;
      },
      providesTags: ["Cities"],
    }),

    fetchCityDetails: builder.query({
      query: (driverId) => `/super-admin/driver-details/${driverId}`,
      providesTags: (result, error, driverId) => [
        { type: "DriverDetails", id: driverId },
      ],
    }),

    addCity: builder.mutation({
      query: ({ country }) => ({
        url: "/super-admin/city/add-city",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { country_code: country },
      }),
      invalidatesTags: () => ["Cities"],
    }),

    toggleCity: builder.mutation({
      query: ({ cityId }) => ({
        url: `/super-admin/city/toggle-city-status/${cityId}`,
        method: "PUT",
      }),
      invalidatesTags: () => ["Cities"],
    }),

    deleteCity: builder.mutation({
      query: ({ cityId }) => ({
        url: `/super-admin/city/delete-city/${cityId}`,
        method: "DELETE",
      }),
      invalidatesTags: () => ["Cities"],
    }),

    fetchCountries: builder.query({
      query: ({ page }) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", "10");

        return `/super-admin/country/get-countries?${params.toString()}`;
      },
      providesTags: ["Countries"],
    }),

    fetchCountryDetails: builder.query({
      query: (driverId) => `/super-admin/driver-details/${driverId}`,
      providesTags: (result, error, driverId) => [
        { type: "DriverDetails", id: driverId },
      ],
    }),

    addCountry: builder.mutation({
      query: ({ country }) => ({
        url: "/super-admin/country/add-country",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { country_code: country },
      }),
      invalidatesTags: () => ["Countries"],
    }),

    toggleCountry: builder.mutation({
      query: ({ countryId }) => ({
        url: `/super-admin/country/toggle-country-status/${countryId}`,
        method: "PUT",
      }),
      invalidatesTags: () => ["Countries"],
    }),

    deleteCountry: builder.mutation({
      query: ({ countryId }) => ({
        url: `/super-admin/country/delete-country/${countryId}`,
        method: "DELETE",
      }),
      invalidatesTags: () => ["Countries"],
    }),
  }),
});

export const {
  useFetchCitiesQuery,
  useFetchCityDetailsQuery,
  useAddCityMutation,
  useToggleCityMutation,
  useDeleteCityMutation,
  useFetchCountriesQuery,
  useFetchCountryDetailsQuery,
  useAddCountryMutation,
  useToggleCountryMutation,
  useDeleteCountryMutation,
} = locationApi;
