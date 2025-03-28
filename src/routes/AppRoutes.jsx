import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import Overview from "../pages/Services/Overview";
import Rentals from "../pages/Services/Rentals";
import BoldAds from "../pages/Services/BoldAds";
import BoldPromotions from "../pages/Services/BoldPromotions";
import Partners from "../pages/Partners";
import FuelCard from "../pages/FuelCard";
import Vehicles from "../pages/Vehicles";
import Drivers from "../pages/Drivers";
import VehicleDetails from "../pages/VehicleDetails";
import DriverDetails from "../pages/DriverDetails";
import PartnerInfo from "../pages/PartnerInfo";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />{" "}
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="vehicles/:vehicleId" element={<VehicleDetails />} />
        <Route path="drivers" element={<Drivers />} />
        <Route path="drivers/:id" element={<DriverDetails />} />
        <Route path="services" element={<Navigate to="services/overview" />} />
        <Route path="services/overview" element={<Overview />} />
        <Route path="services/rentals" element={<Rentals />} />
        <Route path="services/bold-ads" element={<BoldAds />} />
        <Route path="services/bold-promotions" element={<BoldPromotions />} />
        <Route path="partners" element={<Partners />} />
        <Route path="partners/:partnerId" element={<PartnerInfo />} />
        <Route path="fuel-card" element={<FuelCard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
