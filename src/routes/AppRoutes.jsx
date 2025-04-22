import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { lazy, Suspense } from "react";
import MainLayout from "../layout/MainLayout";
import LoadingAnimation from "../components/common/LoadingAnimation";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Vehicles = lazy(() => import("../components/Vehicles"));
const VehicleDetails = lazy(() => import("../components/VehicleDetails"));
const Drivers = lazy(() => import("../components/Drivers"));
const DriverDetails = lazy(() => import("../components/DriverDetails"));
const Overview = lazy(() => import("../pages/Services/Overview"));
const Jumpstart = lazy(() => import("../pages/Services/Jumpstart"));
const Packages = lazy(() => import("../pages/Services/Packages"));
const BoldMiles = lazy(() => import("../pages/Services/BoldMiles"));
const Partners = lazy(() => import("../pages/Partners"));
const PartnerDetails = lazy(() => import("../components/PartnerDetails"));
const Zones = lazy(() => import("../pages/Zones"));
const Login = lazy(() => import("../pages/Login"));
const Location = lazy(() => import("../pages/Location"));
const Coupons = lazy(() => import("../pages/Coupons"));
const NotFound = lazy(() => import("../components/NotFound"));
const EntityNewRequest = lazy(() => import("../components/EntityNewRequest"));
const DriverNewRequest = lazy(() => import("../components/DriverNewRequest"));
const Rides = lazy(() => import("../components/Rides"));
const RideDetails = lazy(() => import("../components/RideDetails"));
const Users = lazy(() => import("../components/Users"));
const UserDetails = lazy(() => import("../components/UserDetails"));
const Conversation = lazy(() => import("../components/Conversation"));
const AddCity = lazy(() => import("../components/AddCity"));
const AddPrices = lazy(() => import("../components/AddPrices"));
const LocationDetails = lazy(() => import("../components/LocationDetails"));
const UpdatePrices = lazy(() => import("../components/UpdatePrices"));
const CreateZone = lazy(() => import("../components/CreateZone"));

const LoginRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading || isAuthenticated === null)
    return <LoadingAnimation width={500} height={500} />;

  return isAuthenticated ? (
    <Navigate to={location.state?.from || "/"} replace />
  ) : (
    <Login />
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading || isAuthenticated === null)
    return <LoadingAnimation width={500} height={500} />;

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingAnimation width={500} height={500} />}>
      <Routes>
        <Route path="/login" element={<LoginRedirect />} />

        <Route path="/" element={<MainLayout />}>
          {/* Dashboard */}
          <Route
            index
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Vehicles */}
          <Route path="vehicles">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Vehicles />
                </ProtectedRoute>
              }
            />
            <Route
              path=":vehicleId"
              element={
                <ProtectedRoute>
                  <VehicleDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="new-requests/:vehicleId"
              element={
                <ProtectedRoute>
                  <EntityNewRequest />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Drivers */}
          <Route path="drivers">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Drivers />
                </ProtectedRoute>
              }
            />
            <Route
              path=":driverId"
              element={
                <ProtectedRoute>
                  <DriverDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="new-requests/:driverId"
              element={
                <ProtectedRoute>
                  <DriverNewRequest />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Rides */}
          <Route path="rides">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Rides />
                </ProtectedRoute>
              }
            />
            <Route
              path=":rideId"
              element={
                <ProtectedRoute>
                  <RideDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path=":rideId/chat/:chatId"
              element={
                <ProtectedRoute>
                  <Conversation />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Users */}
          <Route path="users">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path=":userId"
              element={
                <ProtectedRoute>
                  <UserDetails />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Services */}
          <Route path="services">
            <Route
              index
              element={<Navigate to="/services/overview" replace />}
            />
            <Route
              path="overview"
              element={
                <ProtectedRoute>
                  <Overview />
                </ProtectedRoute>
              }
            />
            <Route
              path="jumpstart"
              element={
                <ProtectedRoute>
                  <Jumpstart />
                </ProtectedRoute>
              }
            />
            <Route
              path="packages"
              element={
                <ProtectedRoute>
                  <Packages />
                </ProtectedRoute>
              }
            />
            <Route
              path="bold-miles"
              element={
                <ProtectedRoute>
                  <BoldMiles />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Partners */}
          <Route path="partners">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Partners />
                </ProtectedRoute>
              }
            />
            <Route
              path=":partnerId"
              element={
                <ProtectedRoute>
                  <PartnerDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path=":partnerId/vehicles"
              element={
                <ProtectedRoute>
                  <Vehicles />
                </ProtectedRoute>
              }
            />
            <Route
              path=":partnerId/drivers"
              element={
                <ProtectedRoute>
                  <Drivers />
                </ProtectedRoute>
              }
            />
            <Route
              path="new-requests/:partnerId"
              element={
                <ProtectedRoute>
                  <EntityNewRequest />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Location */}
          <Route path="location">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Location />
                </ProtectedRoute>
              }
            />
            <Route
              path="city/:cityId"
              element={
                <ProtectedRoute>
                  <LocationDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="city/:cityId/update-prices"
              element={
                <ProtectedRoute>
                  <UpdatePrices />
                </ProtectedRoute>
              }
            />
            <Route
              path="city/add"
              element={
                <ProtectedRoute>
                  <AddCity />
                </ProtectedRoute>
              }
            />
            <Route
              path="city/add/:cityId/prices"
              element={
                <ProtectedRoute>
                  <AddPrices />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Zones */}
          <Route path="zones">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Zones />
                </ProtectedRoute>
              }
            />
            <Route
              path=":zoneId"
              element={
                <ProtectedRoute>
                  <LocationDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path=":zoneId/update-prices"
              element={
                <ProtectedRoute>
                  <UpdatePrices />
                </ProtectedRoute>
              }
            />
            <Route
              path="add"
              element={
                <ProtectedRoute>
                  <CreateZone />
                </ProtectedRoute>
              }
            />
            <Route
              path="add/:zoneId/prices"
              element={
                <ProtectedRoute>
                  <AddPrices />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Coupons */}
          <Route
            path="coupons"
            element={
              <ProtectedRoute>
                <Coupons />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
