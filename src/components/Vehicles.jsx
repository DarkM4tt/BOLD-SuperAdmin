import { useNavigate } from "react-router-dom";

function Vehicles() {
  const navigate = useNavigate();

  const vehicles = [
    { id: "123", name: "Toyota Prius" },
    { id: "456", name: "Honda Civic" },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Vehicles</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-300">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr
              key={vehicle.id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`${vehicle.id}`)}
            >
              <td className="border p-2">{vehicle.id}</td>
              <td className="border p-2">{vehicle.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Vehicles;
