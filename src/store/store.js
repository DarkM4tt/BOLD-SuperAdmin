import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import { organizationApi } from "../services/organizationApi";
import { vehicleApi } from "../services/vehicleApi";
import { driverApi } from "../services/driverApi";
import { rideApi } from "../services/rideApi";
import { userApi } from "../services/userApi";
import { chatApi } from "../services/chatApi";
import { locationApi } from "../services/locationApi";
import { couponApi } from "../services/couponApi";
import { settingsApi } from "../services/settingsApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [vehicleApi.reducerPath]: vehicleApi.reducer,
    [driverApi.reducerPath]: driverApi.reducer,
    [rideApi.reducerPath]: rideApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      organizationApi.middleware,
      vehicleApi.middleware,
      driverApi.middleware,
      rideApi.middleware,
      userApi.middleware,
      chatApi.middleware,
      locationApi.middleware,
      couponApi.middleware,
      settingsApi.middleware
    ),
});
