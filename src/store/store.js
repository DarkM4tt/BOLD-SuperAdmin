import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/authApi";
import { organizationApi } from "../features/organizationApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      organizationApi.middleware
    ),
});
