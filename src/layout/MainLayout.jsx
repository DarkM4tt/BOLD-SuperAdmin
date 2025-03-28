import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import LoadingAnimation from "../components/common/LoadingAnimation";

const MainLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingAnimation height={500} width={500} />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
