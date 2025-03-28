import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import Overview from "../pages/Services/Overview";
import Rentals from "../pages/Services/Rentals";
import BoldAds from "../pages/Services/BoldAds";
import BoldPromotions from "../pages/Services/BoldPromotions";
import Partners from "../pages/Partners";
import Vehicles from "../pages/Vehicles";
import Drivers from "../pages/Drivers";
import VehicleDetails from "../pages/VehicleDetails";
import DriverDetails from "../pages/DriverDetails";
import PartnerInfo from "../pages/PartnerInfo";
import NotFound from "../pages/NotFound";
import Zones from "../pages/Zones";
import Login from "../pages/Login";
import LoadingAnimation from "../components/common/LoadingAnimation";

const LoginRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingAnimation width={500} height={500} />;
  return isAuthenticated ? <Navigate to="/" replace /> : <Login />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginRedirect />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />{" "}
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="vehicles/:vehicleId" element={<VehicleDetails />} />
        <Route path="drivers" element={<Drivers />} />
        <Route path="drivers/:driverId" element={<DriverDetails />} />
        <Route path="services" element={<Navigate to="/services/overview" />} />
        <Route path="services/overview" element={<Overview />} />
        <Route path="services/rentals" element={<Rentals />} />
        <Route path="services/bold-ads" element={<BoldAds />} />
        <Route path="services/bold-promotions" element={<BoldPromotions />} />
        <Route path="partners" element={<Partners />} />
        <Route path="partners/:partnerId" element={<PartnerInfo />} />
        <Route path="zones" element={<Zones />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
