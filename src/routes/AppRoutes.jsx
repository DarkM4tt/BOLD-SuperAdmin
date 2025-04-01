import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import Vehicles from "../components/Vehicles";
import VehicleDetails from "../components/VehicleDetails";
import Drivers from "../components/Drivers";
import DriverDetails from "../components/DriverDetails";
import Overview from "../pages/Services/Overview";
import Jumpstart from "../pages/Services/Jumpstart";
import Packages from "../pages/Services/Packages";
import BoldMiles from "../pages/Services/BoldMiles";
import Partners from "../pages/Partners";
import PartnerDetails from "../components/PartnerDetails";
import Zones from "../pages/Zones";
import Login from "../pages/Login";
import LoadingAnimation from "../components/common/LoadingAnimation";
import Location from "../pages/Location";
import Coupons from "../pages/Coupons";
import NotFound from "../components/NotFound";

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

  if (isLoading || isAuthenticated === null) {
    return <LoadingAnimation width={500} height={500} />;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginRedirect />} />
      <Route path="/" element={<MainLayout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="vehicles"
          element={
            <ProtectedRoute>
              <Vehicles />
            </ProtectedRoute>
          }
        />
        <Route
          path="vehicles/:vehicleId"
          element={
            <ProtectedRoute>
              <VehicleDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="drivers"
          element={
            <ProtectedRoute>
              <Drivers />
            </ProtectedRoute>
          }
        />
        <Route
          path="drivers/:driverId"
          element={
            <ProtectedRoute>
              <DriverDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="services"
          element={
            <ProtectedRoute>
              <Navigate to="/services/overview" />
            </ProtectedRoute>
          }
        />
        <Route
          path="services/overview"
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        />
        <Route
          path="services/jumpstart"
          element={
            <ProtectedRoute>
              <Jumpstart />
            </ProtectedRoute>
          }
        />
        <Route
          path="services/packages"
          element={
            <ProtectedRoute>
              <Packages />
            </ProtectedRoute>
          }
        />
        <Route
          path="services/bold-miles"
          element={
            <ProtectedRoute>
              <BoldMiles />
            </ProtectedRoute>
          }
        />
        <Route
          path="partners"
          element={
            <ProtectedRoute>
              <Partners />
            </ProtectedRoute>
          }
        />
        <Route
          path="partners/:partnerId"
          element={
            <ProtectedRoute>
              <PartnerDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="coupons"
          element={
            <ProtectedRoute>
              <Coupons />
            </ProtectedRoute>
          }
        />
        <Route
          path="location"
          element={
            <ProtectedRoute>
              <Location />
            </ProtectedRoute>
          }
        />
        <Route
          path="zones"
          element={
            <ProtectedRoute>
              <Zones />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
