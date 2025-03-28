import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <div className="grid grid-cols-2 gap-4">
          {/* Vehicles Card */}
          <div
            className="p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => navigate("/vehicles")}
          >
            <h2 className="text-lg font-semibold">Total Vehicles</h2>
            <p className="text-gray-600">View all vehicles</p>
          </div>

          {/* Drivers Card */}
          <div
            className="p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => navigate("/drivers")}
          >
            <h2 className="text-lg font-semibold">Total Drivers</h2>
            <p className="text-gray-600">View all drivers</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
