import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, Tab, Box, Button, Avatar, TableCell } from "@mui/material";
import { formatCreatedAt } from "../utils/dates";
import { useFetchOrganizationDetailsQuery } from "../features/organizationApi";
import { useFetchDriversQuery } from "../features/driverApi";
import InputSearchBar from "./common/InputSearchBar";
import LoadingAnimation from "./common/LoadingAnimation";
import EntityPaginatedTable from "./common/EntityPaginatedTable";
import BackArrow from "../assets/backArrow.svg";
import infoYellow from "../assets/infoYellow.svg";
import wrongIcon from "../assets/wrongIcon.svg";

const NewDriverRequestCard = ({ driverDetails }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white mt-4 rounded-md py-4 pr-6 pl-10 mb-4 relative border-b-[1px] border-[#344BFD]">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          {driverDetails?.profile_pic ? (
            <img
              src={driverDetails?.profile_pic}
              alt="driver-icon"
              width={70}
              className="rounded-full"
            />
          ) : (
            <Avatar sx={{ width: "5rem", height: "5rem", borderRadius: "50%" }}>
              {driverDetails?.full_name?.charAt(0)}
            </Avatar>
          )}
          <div>
            <p className="text-lg font-redhat font-bold">
              {driverDetails?.full_name || "No name"}
            </p>
            <p className="text-base font-redhat font-medium text-gray">
              {driverDetails?.username}
            </p>
          </div>
        </div>

        <div className="flex flex-col">
          <p className="text-lg font-redhat font-bold">Contact info:</p>
          <p className="text-base font-redhat font-medium text-gray">
            Mobile: {driverDetails?.phone || "Not provided!"}
          </p>
          <p className="text-base font-redhat font-medium text-gray">
            Email: {driverDetails?.email}
          </p>
        </div>

        <Button
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: "600",
            borderColor: "#000",
            color: "#000",
            borderRadius: "10px",
            paddingInline: "30px",
            "&:hover": {
              borderColor: "#000",
              backgroundColor: "rgba(0,0,0,0.05)",
            },
          }}
          onClick={() =>
            navigate(`/drivers/new-requests/${driverDetails?._id}`)
          }
        >
          Accept and review
        </Button>
      </div>
    </div>
  );
};

const renderDriverRow = (driver, selectedTab) => {
  return (
    <>
      <TableCell>
        <div className="flex items-center gap-2">
          {driver?.profile_pic ? (
            <img
              src={driver?.profile_pic}
              className="w-8 h-8 rounded-full"
              alt="driver-image"
            />
          ) : (
            <Avatar
              sx={{
                width: 40,
                height: 40,
                fontSize: 15,
                cursor: "pointer",
                backgroundColor: "black",
              }}
            >
              {driver?.full_name
                ?.split(" ")
                .map((word) => word.charAt(0))
                .join("")
                .toUpperCase()}
            </Avatar>
          )}
          {driver?.full_name || <p className="text-red-500">No name</p>}
        </div>
      </TableCell>
      <TableCell>
        {driver?.createdAt ? (
          formatCreatedAt(driver?.createdAt)
        ) : (
          <p className="text-red-400">Not added yet!</p>
        )}
      </TableCell>
      <TableCell>
        {driver?.vehicle || <p className="text-red-400">Not assigned yet!</p>}
      </TableCell>
      <TableCell>{driver?.total_rides || 0}</TableCell>
      <TableCell>{driver?.rating ? driver?.rating + "/5" : 0}</TableCell>
      {selectedTab !== "APPROVED" && selectedTab !== "ASSIGNED" ? (
        <TableCell>
          <div className="flex">
            {driver?.rejected_documents > 0 && (
              <span
                className={`bg-[#f9ecea] pl-4 pr-2 py-2 ${
                  driver?.pending_documents > 0
                    ? "rounded-l-2xl"
                    : "rounded-2xl"
                } text-[#D40038] flex items-center`}
              >
                <img src={wrongIcon} alt="wrongIcon" className="mr-1" />
                <p>{driver?.rejected_documents}</p>
              </span>
            )}
            {driver?.pending_documents > 0 && (
              <span
                className={`bg-[#f9ecea] pl-2 pr-4 py-2 ${
                  driver?.rejected_documents > 0
                    ? "rounded-r-2xl"
                    : "rounded-2xl"
                } text-[#C07000] flex items-center`}
              >
                <img src={infoYellow} alt="infoYellow" className="mr-1" />
                <p>{driver?.pending_documents}</p>
              </span>
            )}
            {driver?.total_documents === 9 &&
              driver?.verified_documents === 9 && (
                <p className="text-green-400 font-bold">Approved</p>
              )}
            {driver?.total_documents < 9 &&
              driver?.total_documents > 0 &&
              driver?.pending_documents === 0 &&
              driver?.rejected_documents === 0 && (
                <p className="text-red-400 font-bold">
                  {9 - driver?.total_documents} not uploaded!
                </p>
              )}
            {driver?.total_documents === 0 && (
              <p className="text-red-400 font-bold">Not Uploaded!</p>
            )}
          </div>
        </TableCell>
      ) : (
        <TableCell>{driver?.issue_raised || 0}</TableCell>
      )}
    </>
  );
};

const Drivers = () => {
  const [selectedTab, setSelectedTab] = useState("APPROVED");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const params = useParams();
  const { partnerId } = params;
  const { data: orgdata } = useFetchOrganizationDetailsQuery(partnerId, {
    skip: !partnerId,
  });

  const getQueryParams = () => {
    if (selectedTab === "ASSIGNED") {
      return { is_vehicle: true };
    }
    return {
      status:
        selectedTab === "ALL"
          ? "APPROVED"
          : selectedTab === "PENDING"
          ? "PENDING"
          : selectedTab === "NEW-REQUEST"
          ? "NEW-REQUEST"
          : selectedTab === "REJECTED"
          ? "REJECTED"
          : "APPROVED",
    };
  };

  const queryParams = getQueryParams();
  const { data, error, isLoading } = useFetchDriversQuery({
    ...queryParams,
    page,
    partnerId,
  });

  if (isLoading) return <LoadingAnimation width={500} height={500} />;
  if (error)
    return (
      <p className="text-red-400 text-lg font-redhat font-semibold">
        {error?.data?.message || "Error fetching data "}{" "}
      </p>
    );

  const {
    results = [],
    totalPages,
    isNextPage,
    isPreviousPage,
  } = data.drivers || {};

  const headers = [
    "Name",
    "Joined on",
    "Assigned vehicle",
    "Total trips",
    "Customer rating",
    selectedTab !== "APPROVED" && selectedTab !== "ASSIGNED"
      ? "Documents Status"
      : "Issues/queries",
  ];

  return (
    <Box>
      <div className="flex items-center justify-between w-full mb-5">
        <span className="font-redhat font-semibold text-base text-gray-700">
          {`${partnerId ? "> Partners" : ""} > Drivers`}
        </span>
        <InputSearchBar />
      </div>

      <div className="flex items-center gap-4 text-2xl font-medium mb-5">
        <img
          src={BackArrow}
          alt="BackArrow"
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        {`${
          orgdata?.data?.full_name ? orgdata?.data?.full_name + " >> " : ""
        }  Manage & find drivers`}
      </div>

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
        <Tab label="All drivers" value="APPROVED" />
        <Tab label="Pending drivers" value="PENDING" />
        <Tab label="New Requests" value="NEW-REQUEST" />
        <Tab label="Rejected drivers" value="REJECTED" />
        <Tab label="Assigned drivers" value="ASSIGNED" />
      </Tabs>

      {selectedTab === "NEW-REQUEST" ? (
        results?.length > 0 ? (
          results?.map((driver) => (
            <NewDriverRequestCard driverDetails={driver} key={driver?._id} />
          ))
        ) : (
          <p className="text-lg font-bold text-red-400 font-redhat mt-5">
            No new drivers!
          </p>
        )
      ) : (
        <EntityPaginatedTable
          headers={headers}
          rows={results}
          renderRow={(driver) => renderDriverRow(driver, selectedTab)}
          emptyMessage="No drivers!"
          onRowClick={(driver) => navigate(`/drivers/${driver?._id}`)}
          isPreviousPage={isPreviousPage}
          isNextPage={isNextPage}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      )}
    </Box>
  );
};

export default Drivers;
