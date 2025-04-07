import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TableCell } from "@mui/material";
import { useFetchUsersQuery } from "../features/userApi";
import EntityPaginatedTable from "./common/EntityPaginatedTable";
import LoadingAnimation from "./common/LoadingAnimation";
import InputSearchBar from "./common/InputSearchBar";
import BackArrow from "../assets/backArrow.svg";

const headers = [
  "Name",
  "User ID",
  "Phone number",
  "Email ID",
  "Total spends",
  "Total booked rides",
];

const renderRideRow = (customer) => {
  return (
    <>
      <TableCell>
        <div className="flex items-center gap-2">
          {customer?.full_name || <p className="text-red-500">No name!</p>}
        </div>
      </TableCell>
      <TableCell>
        {customer?.username || <p className="text-red-500">No username!</p>}
      </TableCell>
      <TableCell>
        {customer?.phone || <p className="text-red-400">Not contact yet!</p>}
      </TableCell>
      <TableCell>
        {customer?.email || <p className="text-red-500">No email yet!</p>}
      </TableCell>
      <TableCell>{"€ " + customer?.total_spends || 0}</TableCell>
      <TableCell>{customer?.total_rides_booked || 0}</TableCell>
    </>
  );
};

const Users = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useFetchUsersQuery({ page });
  const { results, totalPages, isNextPage, isPreviousPage } =
    data?.customers || {};
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
        {"> Dashboard > Users"}
        <InputSearchBar />
      </div>

      <div className="flex gap-4 items-center">
        <img
          src={BackArrow}
          alt="BackArrow"
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <Box sx={{ fontSize: "24px", fontWeight: "600" }}>List of users</Box>
      </div>

      {isLoading ? (
        <LoadingAnimation height={500} width={500} />
      ) : (
        <EntityPaginatedTable
          headers={headers}
          rows={results}
          renderRow={(user) => renderRideRow(user)}
          emptyMessage="No rides yet!"
          onRowClick={(user) => navigate(`/users/${user?._id}`)}
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

export default Users;
