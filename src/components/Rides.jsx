import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TableCell, TextField, MenuItem } from "@mui/material";
import { useFetchRidesQuery } from "../services/rideApi";
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

const rideStatusOptions = [
  { label: "All", value: "" },
  { label: "Booked", value: "BOOKED" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Completed", value: "COMPLETED" },
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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const queryParams = { page };

  if (fromDate) queryParams.from = fromDate;
  if (toDate) queryParams.to = toDate;
  if (status) queryParams.status = status;

  const { data, error, isLoading } = useFetchRidesQuery(queryParams);
  const { results, totalPages, isNextPage, isPreviousPage } =
    data?.data?.rides || {};

  if (error) {
    return (
      <p className="text-red-400 text-lg font-redhat font-semibold">
        {error?.data?.message || "Error fetching data "}
      </p>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  const handleFromDateChange = (e) => {
    const newFromDate = e.target.value;
    setFromDate(newFromDate);
    if (toDate && newFromDate > toDate) {
      setToDate("");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center font-redhat text-base font-semibold mb-8">
        {"> Dashboard > Rides"}
        <InputSearchBar />
      </div>

      <div className="flex gap-4 items-center mb-6">
        <img
          src={BackArrow}
          alt="BackArrow"
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <Box sx={{ fontSize: "24px", fontWeight: "600" }}>All Ride History</Box>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* From Date */}
        <TextField
          type="date"
          label="From Date"
          InputLabelProps={{ shrink: true }}
          size="small"
          value={fromDate}
          onChange={handleFromDateChange}
          sx={{ width: 200 }}
          inputProps={{
            max: today,
          }}
        />
        {/* To Date */}
        <TextField
          type="date"
          label="To Date"
          InputLabelProps={{ shrink: true }}
          size="small"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          sx={{ width: 200 }}
          inputProps={{
            min: fromDate || undefined,
            max: today,
          }}
        />
        {/* Status Select */}
        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          size="small"
          sx={{ width: 200 }}
        >
          {rideStatusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>

      {/* Table */}
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
