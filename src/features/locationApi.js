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
    "CountryDetails",
    "Cities",
    "CityDetails",
    "Zones",
    "ZoneDetails",
    "RideTypePrices",
  ],
  endpoints: (builder) => ({
    fetchRideTypePrices: builder.query({
      query: ({ cityId, zoneId }) => {
        const params = new URLSearchParams();
        cityId && params.append("city_id", cityId);
        zoneId && params.append("zone_id", zoneId);

        return `/super-admin/ride-type-prices?${params.toString()}`;
      },
      providesTags: ["RideTypePrices"],
    }),

    addPrices: builder.mutation({
      query: (body) => ({
        url: "/super-admin/ride-type-prices/create",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }),
      invalidatesTags: ["RideTypePrices"],
    }),

    deleteRideTypePrice: builder.mutation({
      query: (id) => ({
        url: `/super-admin/ride-type-prices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RideTypePrices"],
    }),

    updateRideTypePrice: builder.mutation({
      query: ({ data, id }) => ({
        url: `/super-admin/ride-type-prices/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
      invalidatesTags: ["RideTypePrices"],
    }),

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
      query: (cityId) => `/super-admin/city/get-city/${cityId}`,
      providesTags: (result, error, cityId) => [
        { type: "CityDetails", id: cityId },
      ],
    }),

    addCity: builder.mutation({
      query: (body) => ({
        url: "/super-admin/city/add-city",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
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

    updateCity: builder.mutation({
      query: ({ cityId, body }) => ({
        url: `/super-admin/city/update-city/${cityId}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body,
      }),
      invalidatesTags: (result, error, { cityId }) => [
        { type: "CityDetails", id: cityId },
      ],
    }),

    deleteCity: builder.mutation({
      query: ({ cityId }) => ({
        url: `/super-admin/city/delete-city/${cityId}`,
        method: "DELETE",
      }),
      invalidatesTags: () => ["Cities"],
    }),

    fetchCountries: builder.query({
      query: ({ page, limit }) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit || "10");

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

    fetchZones: builder.query({
      query: ({ page, cityId }) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", cityId ? "100" : "10");
        cityId && params.append("city_id", cityId);

        return `/super-admin/zones?${params.toString()}`;
      },
      providesTags: ["Zones"],
    }),

    fetchZoneDetails: builder.query({
      query: (zoneId) => `/super-admin/zones/${zoneId}`,
      providesTags: (result, error, zoneId) => [
        { type: "ZoneDetails", id: zoneId },
      ],
    }),

    updateZone: builder.mutation({
      query: ({ zoneId, body }) => ({
        url: `/super-admin/zones/update/${zoneId}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body,
      }),
      invalidatesTags: (result, error, { zoneId }) => [
        { type: "ZoneDetails", id: zoneId },
      ],
    }),
  }),
});

export const {
  useFetchRideTypePricesQuery,
  useAddPricesMutation,
  useDeleteRideTypePriceMutation,
  useUpdateRideTypePriceMutation,
  useFetchCitiesQuery,
  useFetchCityDetailsQuery,
  useAddCityMutation,
  useToggleCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
  useFetchCountriesQuery,
  useFetchCountryDetailsQuery,
  useAddCountryMutation,
  useToggleCountryMutation,
  useDeleteCountryMutation,
  useFetchZonesQuery,
  useFetchZoneDetailsQuery,
  useUpdateZoneMutation,
} = locationApi;
