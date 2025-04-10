import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_CHAT_URL,
  credentials: "include",
});

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery,
  tagTypes: ["Chats"],
  endpoints: (builder) => ({
    fetchChats: builder.query({
      query: ({ page, chatId }) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", "10");
        params.append("sortBy", "asc");

        return `/messages/super-admin/${chatId}?${params.toString()}`;
      },
      providesTags: ["Chats"],
    }),
  }),
});

export const { useFetchChatsQuery } = chatApi;
