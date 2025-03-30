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
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 px-10 py-8 bg-[#F8F8F8] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
