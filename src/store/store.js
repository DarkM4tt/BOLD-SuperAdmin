import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/authApi";
import { organizationApi } from "../features/organizationApi";
import { vehicleApi } from "../features/vehicleApi";
import { driverApi } from "../features/driverApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [vehicleApi.reducerPath]: vehicleApi.reducer,
    [driverApi.reducerPath]: driverApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      organizationApi.middleware,
      vehicleApi.middleware,
      driverApi.middleware
    ),
});
