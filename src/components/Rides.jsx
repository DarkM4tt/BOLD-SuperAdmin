import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TableCell } from "@mui/material";
import { useFetchRidesQuery } from "../features/rideApi";
import { useSnackbar } from "../context/SnackbarProvider";
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
  return (
    <>
      <TableCell>
        <div className="flex items-center gap-2">
          {ride?.customer_info?.full_name || (
            <p className="text-red-500">No user name!</p>
          )}
        </div>
      </TableCell>
      <TableCell>
        {ride?.driver_info?.full_name || (
          <p className="text-red-500">No driver name!</p>
        )}
      </TableCell>
      <TableCell>
        {ride?.vehicle_info?.vin || (
          <p className="text-red-400">Not vehicle number!</p>
        )}
      </TableCell>
      <TableCell>
        {ride?.ride_service || <p className="text-red-500">No known!</p>}
      </TableCell>
      <TableCell>{ride?.status}</TableCell>
      <TableCell>{ride?.captured_amount}</TableCell>
    </>
  );
};

const AllRides = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useFetchRidesQuery({ page });
  const { results, totalPages, isNextPage, isPreviousPage } =
    data?.data?.rides || {};
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  if (error) {
    showSnackbar(error?.data?.message || "Error fetching data....");
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

export default AllRides;
