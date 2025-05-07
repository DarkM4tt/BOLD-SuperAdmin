import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SettingsData } from "../types/settings";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_RIDE_URL,
  credentials: "include",
});

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery,
  tagTypes: ["Settings"],
  endpoints: (builder) => ({
    getSettings: builder.query<SettingsData, void>({
      query: () => "super-admin/settings/get-settings",
      transformResponse: (response: any): SettingsData =>
        response.data.settings[0] as SettingsData,
      providesTags: ["Settings"],
    }),

    updateSettings: builder.mutation<
      SettingsData,
      { payload: Partial<SettingsData>; id: string }
    >({
      query: ({ payload, id }) => ({
        url: `super-admin/settings/update/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
