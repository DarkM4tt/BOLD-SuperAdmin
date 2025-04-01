import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useFetchOrganizationsQuery } from "../features/organizationApi";
import { formatCreatedAt } from "../utils/dates";
import PaginatedTable from "../components/common/PaginatedTable";
import { useNavigate } from "react-router-dom";
import InputSearchBar from "../components/common/InputSearchBar";
import LoadingAnimation from "../components/common/LoadingAnimation";

const Partners = () => {
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const getQueryParams = () => {
    switch (selectedTab) {
      case "ALL":
        return { status: "APPROVED" };
      case "PENDING":
        return { status: "PENDING" };
      case "NEW_REQUESTS":
        return { status: "NEW-REQUEST" };
      case "REJECTED":
        return { status: "REJECTED" };
      case "INCOMPLETE":
        return { is_completed: false };
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

  if (isLoading) return <LoadingAnimation width={500} height={500} />;
  if (error)
    return (
      <p className="text-red-400 text-lg font-redhat font-semibold">
        {error?.data?.message || "Error fetching data"}
      </p>
    );

  const partnerColumns = [
    {
      key: "full_name",
      label: "Name",
      render: (val) => (
        <div className="flex items-center gap-2">
          {/* <img src={PartnerIcon} alt="Icon" /> */}
          {val || <p className="text-red-500">No name</p>}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Operating Since",
      render: (val) =>
        formatCreatedAt(val) || <p className="text-red-200">Unknown</p>,
    },
    { key: "total_drivers", label: "Total Drivers" },
    { key: "total_vehicles", label: "Total Vehicles" },
    { key: "listing_assignments", label: "Listing Drivers" },
    {
      key: "documents",
      label: "Documents Status",
      render: (_, row) => (
        <div className="flex">
          {row.rejected_documents > 0 && (
            <span
              className={`bg-[#f9ecea] pl-4 pr-2 py-2 ${
                row.pending_documents > 0 ? "rounded-l-2xl" : "rounded-2xl"
              } text-[#D40038] flex items-center`}
            >
              {/* <img src={wrongIcon} alt="wrongIcon" className="mr-1" /> */}
              <p>{row.rejected_documents}</p>
            </span>
          )}
          {row.pending_documents > 0 && (
            <span
              className={`bg-[#f9ecea] pl-2 pr-4 py-2 ${
                row.rejected_documents > 0 ? "rounded-r-2xl" : "rounded-2xl"
              } text-[#C07000] flex items-center`}
            >
              {/* <img src={infoYellow} alt="infoYellow" className="mr-1" /> */}
              <p>{row.pending_documents}</p>
            </span>
          )}
          {row.total_documents === 6 && row.verified_documents === 6 && (
            <p className="text-green-400 font-bold">Approved</p>
          )}
          {row.total_documents < 6 &&
            row.total_documents > 0 &&
            row.pending_documents === 0 &&
            row.rejected_documents === 0 && (
              <p className="text-red-400 font-bold">
                {6 - row.total_documents} not uploaded!
              </p>
            )}
          {row.total_documents === 0 && (
            <p className="text-red-400 font-bold">Not Uploaded!</p>
          )}
        </div>
      ),
    },
  ];

  const {
    results = [],
    totalPages,
    isNextPage,
    isPreviousPage,
  } = data.organizations || {};

  return (
    <Box>
      <div className="flex items-center justify-between w-full font-redhat text-base font-semibold mb-8">
        <p className="flex items-center gap-1">
          <span>&gt;</span>
          <span>Partners</span>
        </p>
        <InputSearchBar />
      </div>

      <Box sx={{ fontSize: "24px", fontWeight: "500", marginBottom: "20px" }}>
        Manage & find organisation
      </Box>

      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => {
          setPage(1);
          setSelectedTab(newValue);
        }}
        sx={{
          borderBottom: "1px solid #d3d3d3",
          width: "fit-content",
          ".MuiTab-root": {
            textTransform: "none",
            fontWeight: 500,
            color: "#9e9e9e",
          },
          ".Mui-selected": { color: "#1976d2", fontWeight: "bold" },
          ".MuiTabs-indicator": { backgroundColor: "#1976d2" },
        }}
      >
        <Tab label="All" value="ALL" />
        <Tab label="Pending" value="PENDING" />
        <Tab label="New Requests" value="NEW_REQUESTS" />
        <Tab label="Rejected" value="REJECTED" />
        <Tab label="Incomplete Signup" value="INCOMPLETE" />
      </Tabs>

      <PaginatedTable
        columns={partnerColumns}
        data={results || []}
        onRowClick={(partnerId) => navigate(`/partners/${partnerId}`)}
        isPreviousPage={isPreviousPage}
        isNextPage={isNextPage}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </Box>
  );
};

export default Partners;
