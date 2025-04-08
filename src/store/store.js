import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/authApi";
import { organizationApi } from "../features/organizationApi";
import { vehicleApi } from "../features/vehicleApi";
import { driverApi } from "../features/driverApi";
import { rideApi } from "../features/rideApi";
import { userApi } from "../features/userApi";
import { chatApi } from "../features/chatApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [vehicleApi.reducerPath]: vehicleApi.reducer,
    [driverApi.reducerPath]: driverApi.reducer,
    [rideApi.reducerPath]: rideApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      organizationApi.middleware,
      vehicleApi.middleware,
      driverApi.middleware,
      rideApi.middleware,
      userApi.middleware,
      chatApi.middleware
    ),
});
