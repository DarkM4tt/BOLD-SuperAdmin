import { useState } from "react";
import { CircularProgress, Button, Tabs, Tab } from "@mui/material";
import { useFetchOrganizationsQuery } from "../features/organizationApi";

const Partners = () => {
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [page, setPage] = useState(1);

  const getQueryParams = () => {
    switch (selectedTab) {
      case "ALL":
        return { status: "APPROVED" };
      case "PENDING":
        return { status: "PENDING" };
      case "NEW_REQUESTS":
        return { status: "NEW-REQUEST" };
      case "INCOMPLETE":
        return { isActive: true };
      default:
        return { status: "APPROVED" };
    }
  };

  const { status, isActive } = getQueryParams();
  const { data, error, isLoading } = useFetchOrganizationsQuery({
    status,
    isActive,
    page,
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <p>Error fetching data</p>;

  const {
    results = [],
    totalPages,
    isNextPage,
    isPreviousPage,
  } = data.organizations || {};

  return (
    <div className="p-4">
      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}
      >
        <Tab label="All" value="ALL" />
        <Tab label="Pending" value="PENDING" />
        <Tab label="New Requests" value="NEW_REQUESTS" />
        <Tab label="Incomplete Signup" value="INCOMPLETE" />
      </Tabs>

      <div className="mt-4">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Operating Since</th>
              <th className="p-2 border">Total Drivers</th>
              <th className="p-2 border">Total Vehicles</th>
              <th className="p-2 border">Listing Drivers</th>
              <th className="p-2 border">Issues/Queries</th>
            </tr>
          </thead>
          <tbody>
            {results.map((org, idx) => (
              <tr key={org._id} className="text-center border">
                <td className="p-2 border">{idx + 1}</td>
                <td className="p-2 border">{org?.full_name}</td>
                <td className="p-2 border">{org?.operatingSince}</td>
                <td className="p-2 border">{org?.totalDrivers}</td>
                <td className="p-2 border">{org?.totalVehicles}</td>
                <td className="p-2 border">{org?.listingDrivers}</td>
                <td className="p-2 border">{org?.issuesQueries}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between">
        <Button
          disabled={!isPreviousPage}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          variant="contained"
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          disabled={!isNextPage}
          onClick={() => setPage((prev) => prev + 1)}
          variant="contained"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Partners;
