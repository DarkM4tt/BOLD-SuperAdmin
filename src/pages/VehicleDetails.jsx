import { useParams } from "react-router-dom";

function VehicleDetails() {
  const { vehicleId } = useParams();

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Vehicle Details</h2>
      <p>Vehicle ID: {vehicleId}</p>
      <p>More details about the vehicle go here...</p>
    </div>
  );
}

export default VehicleDetails;
