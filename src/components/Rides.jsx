import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TableCell } from "@mui/material";
import { useFetchRidesQuery } from "../features/rideApi";
import EntityPaginatedTable from "./common/EntityPaginatedTable";
import LoadingAnimation from "./common/LoadingAnimation";
import InputSearchBar from "./common/InputSearchBar";
import BackArrow from "../assets/backArrow.svg";

const headers = [
  "User",
  "Driver",
  "Vehicle number",
  "Service",
  "Status",
  "Captured amount",
];

const renderRideRow = (ride) => {
  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;

  return (
    <>
      <TableCell>
        <div className="flex items-center gap-2">
          {ride?.customer_info?.full_name ? (
            ride.customer_info.full_name
          ) : (
            <p className="text-red-500">No user name!</p>
          )}
        </div>
      </TableCell>
      <TableCell>
        {ride?.driver_info?.full_name ? (
          ride.driver_info.full_name
        ) : (
          <p className="text-gray-500">Not assigned!</p>
        )}
      </TableCell>
      <TableCell>
        {ride?.vehicle_info?.vin ? (
          ride.vehicle_info.vin
        ) : (
          <p className="text-gray-500">Not assigned!</p>
        )}
      </TableCell>
      <TableCell>
        {ride?.ride_service ? (
          capitalize(ride.ride_service)
        ) : (
          <p className="text-red-500">Not known!</p>
        )}
      </TableCell>
      <TableCell>
        {ride?.status ? (
          capitalize(ride.status)
        ) : (
          <p className="text-red-500">Not known!</p>
        )}
      </TableCell>
      <TableCell>{ride?.captured_amount || "-"}</TableCell>
    </>
  );
};

const Rides = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useFetchRidesQuery({ page });
  const { results, totalPages, isNextPage, isPreviousPage } =
    data?.data?.rides || {};
  const navigate = useNavigate();

  if (error) {
    return (
      <p className="text-red-400 text-lg font-redhat font-semibold">
        {error?.data?.message || "Error fetching data "}{" "}
      </p>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center font-redhat text-base font-semibold mb-8">
        {"> Dashboard > Rides"}
        <InputSearchBar />
      </div>

      <div className="flex gap-4 items-center">
        <img
          src={BackArrow}
          alt="BackArrow"
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <Box sx={{ fontSize: "24px", fontWeight: "600" }}>All Ride History</Box>
      </div>

      {isLoading ? (
        <LoadingAnimation height={500} width={500} />
      ) : (
        <EntityPaginatedTable
          headers={headers}
          rows={results}
          renderRow={(ride) => renderRideRow(ride)}
          emptyMessage="No rides yet!"
          onRowClick={(ride) => navigate(`/rides/${ride?._id}`)}
          isPreviousPage={isPreviousPage}
          isNextPage={isNextPage}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      )}
    </>
  );
};

export default Rides;
