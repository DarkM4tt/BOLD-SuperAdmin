import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, Tab, Box, Button, TableCell } from "@mui/material";
import { formatCreatedAt } from "../utils/dates";
import {
  useFetchAssignedVehiclesQuery,
  useFetchVehiclesQuery,
} from "../features/vehicleApi";
import { useFetchOrganizationDetailsQuery } from "../features/organizationApi";
import InputSearchBar from "./common/InputSearchBar";
import LoadingAnimation from "./common/LoadingAnimation";
import EntityPaginatedTable from "./common/EntityPaginatedTable";
import Pagination from "./common/Pagination";
import infoYellow from "../assets/infoYellow.svg";
import wrongIcon from "../assets/wrongIcon.svg";
import BackArrow from "../assets/backArrow.svg";

const NewVehicleRequestCard = ({ vehicleDetails }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white mt-4 rounded-md py-4 pr-6 pl-10 mb-4 relative border-b-[1px] border-[#344BFD]">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <img src={vehicleDetails?.vehicle_image} alt="OrgBig" width={70} />
          <div>
            <p className="text-lg font-redhat font-bold">Vehicle</p>
            <p className="text-base font-redhat font-medium text-gray">
              {vehicleDetails?.brand_name} {vehicleDetails?.vehicle_model}
            </p>
          </div>
        </div>

        <div className="flex flex-col">
          <p className="text-lg font-redhat font-bold">TVDE Applicable</p>
          <p className="text-base font-redhat font-bold">
            Yes : <span className="text-gray font-semibold">Until</span> : 22 -
            01 - 2027
          </p>
        </div>

        <div className="flex flex-col">
          <p className="text-lg font-redhat font-bold">Organisation</p>
          <p className="text-base font-redhat font-medium text-gray">
            {vehicleDetails?.organization_id?.full_name || "No name"}
          </p>
          <p className="text-base font-redhat font-medium text-gray">
            Status:{" "}
            <span className="text-boldCyan font-semibold">
              {vehicleDetails?.organization_id?.status || "Unknown!"}
            </span>
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
            navigate(`/vehicles/new-requests/${vehicleDetails?._id}`)
          }
        >
          Accept and review
        </Button>
      </div>
    </div>
  );
};

const renderVehicleRow = (vehicle, selectedTab, partnerId) => {
  if (selectedTab === "ASSIGNED") {
    return (
      <>
        <TableCell>
          {vehicle?.vehicle_id?.vehicle_model || vehicle?.vehicle_id?.brand_name
            ? `${
                vehicle?.vehicle_id?.vehicle_model
                  ? vehicle?.vehicle_id?.vehicle_model
                  : ""
              } ${
                vehicle?.vehicle_id?.brand_name
                  ? vehicle?.vehicle_id?.brand_name
                  : ""
              }`
            : "Not provided!"}
        </TableCell>
        <TableCell>
          {partnerId
            ? vehicle?.vehicle_id?.ride_type?.type || "Not added yet!"
            : vehicle?.organization_id?.full_name || "Not added yet!"}
        </TableCell>
        <TableCell>{vehicle?.vehicle_id?.vin || "Null"}</TableCell>
        <TableCell>
          {vehicle?.vehicle_id?.createdAt
            ? formatCreatedAt(vehicle?.vehicle_id?.createdAt)
            : "Null"}
        </TableCell>
        <TableCell>
          {vehicle?.driver?.full_name || "Not assigned yet!"}
        </TableCell>
        <TableCell>{vehicle?.vehicle_id?.color || "Not provided!"}</TableCell>
      </>
    );
  }

  return (
    <>
      <TableCell>
        {vehicle?.vehicle_model
          ? `${vehicle?.vehicle_model} ${vehicle?.brand_name}`
          : "Not provided!"}
      </TableCell>
      <TableCell>
        {partnerId
          ? vehicle?.ride_type?.type || "Not assigned yet!"
          : vehicle?.organization_id?.full_name || "Not added yet!"}
      </TableCell>
      <TableCell>{vehicle?.vin || "Null"}</TableCell>
      <TableCell>
        {vehicle?.createdAt ? formatCreatedAt(vehicle?.createdAt) : "Null"}
      </TableCell>
      <TableCell>{vehicle?.seats || "Not provided!"}</TableCell>
      {selectedTab === "APPROVED" ? (
        <TableCell>{vehicle?.color}</TableCell>
      ) : (
        <TableCell>
          <div className="flex">
            {vehicle?.rejected_documents > 0 && (
              <span
                className={`bg-[#f9ecea] pl-4 pr-2 py-2 ${
                  vehicle?.pending_documents > 0
                    ? "rounded-l-2xl"
                    : "rounded-2xl"
                } text-[#D40038] flex items-center`}
              >
                <img src={wrongIcon} alt="wrongIcon" className="mr-1" />
                <p>{vehicle?.rejected_documents}</p>
              </span>
            )}
            {vehicle?.pending_documents > 0 && (
              <span
                className={`bg-[#f9ecea] pl-2 pr-4 py-2 ${
                  vehicle?.rejected_documents > 0
                    ? "rounded-r-2xl"
                    : "rounded-2xl"
                } text-[#C07000] flex items-center`}
              >
                <img src={infoYellow} alt="infoYellow" className="mr-1" />
                <p>{vehicle?.pending_documents}</p>
              </span>
            )}
            {vehicle?.total_documents === 4 &&
              vehicle?.verified_documents === 4 && (
                <p className="text-green-400 font-bold">Approved</p>
              )}
            {vehicle?.total_documents < 4 &&
              vehicle?.total_documents > 0 &&
              vehicle?.pending_documents === 0 &&
              vehicle?.rejected_documents === 0 && (
                <p className="text-red-400 font-bold">
                  {4 - vehicle?.total_documents} not uploaded!
                </p>
              )}
            {vehicle?.total_documents === 0 && (
              <p className="text-red-400 font-bold">Not Uploaded!</p>
            )}
          </div>
        </TableCell>
      )}
    </>
  );
};

const Vehicles = () => {
  const [selectedTab, setSelectedTab] = useState("APPROVED");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const params = useParams();
  const { partnerId } = params;
  const { data: orgdata } = useFetchOrganizationDetailsQuery(partnerId, {
    skip: !partnerId,
  });

  const getQueryParams = () => {
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

  const { data, error, isLoading } = useFetchVehiclesQuery({
    ...queryParams,
    page,
    partnerId,
  });
  const {
    data: assignedVehiclesData,
    error: assignedVehiclesError,
    isLoading: assignedVehiclesLoading,
  } = useFetchAssignedVehiclesQuery({
    page,
    partnerId,
  });

  if (isLoading || assignedVehiclesLoading)
    return <LoadingAnimation width={500} height={500} />;
  if (error || assignedVehiclesError)
    return (
      <p className="text-red-400 text-lg font-redhat font-semibold">
        {error?.data?.message || "Error fetching data "}{" "}
        {assignedVehiclesError?.data?.message || "Error fetching data "}
      </p>
    );

  const {
    results = [],
    totalPages,
    isNextPage,
    isPreviousPage,
  } = data.vehicles || {};

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pageNumbers.push(i);
    } else if (i === page - 2 || i === page + 2) {
      pageNumbers.push("...");
    }
  }

  const {
    results: assignedResults = [],
    totalPages: assignedTotalPages,
    isNextPage: assignedIsNextPage,
    isPreviousPage: assignedIsPreviousPage,
  } = assignedVehiclesData.assignments || {};

  const headers = [
    "Vehicle model",
    partnerId ? "Category" : "Organization",
    "Plate number",
    "Operating since",
    selectedTab === "ASSIGNED" ? "Assigned Driver" : "Seats",
    selectedTab !== "APPROVED" && selectedTab !== "ASSIGNED"
      ? "Documents Status"
      : "Color",
  ];

  return (
    <Box>
      <div className="flex items-center justify-between w-full mb-5">
        <span className="font-redhat font-semibold text-base text-gray-700">
          {`${partnerId ? "> Partners" : ""} > Vehicles`}
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
        }  Manage & find vehicles`}
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
        <Tab label="All vehicles" value="APPROVED" />
        <Tab label="Pending vehicles" value="PENDING" />
        <Tab label="New Requests" value="NEW-REQUEST" />
        <Tab label="Rejected vehicles" value="REJECTED" />
        <Tab label="Assigned vehicles" value="ASSIGNED" />
      </Tabs>

      {selectedTab === "NEW-REQUEST" ? (
        results?.length > 0 ? (
          <>
            <div className="flex flex-col max-h-[500px] overflow-y-auto">
              {results?.map((vehicle) => (
                <NewVehicleRequestCard
                  vehicleDetails={vehicle}
                  key={vehicle?._id}
                />
              ))}
            </div>
            {results?.length > 0 && (
              <Pagination
                pageNumbers={pageNumbers}
                page={page}
                setPage={setPage}
                isPreviousPage={isPreviousPage}
                isNextPage={isNextPage}
              />
            )}
          </>
        ) : (
          <p className="text-lg font-bold text-red-400 font-redhat mt-5">
            No new vehicles!
          </p>
        )
      ) : selectedTab === "ASSIGNED" ? (
        <EntityPaginatedTable
          headers={headers}
          rows={assignedResults}
          renderRow={(vehicle) =>
            renderVehicleRow(vehicle, selectedTab, partnerId)
          }
          emptyMessage="No vehicles!"
          onRowClick={(vehicle) =>
            navigate(`/vehicles/${vehicle?.vehicle_id?._id}`)
          }
          isPreviousPage={assignedIsPreviousPage}
          isNextPage={assignedIsNextPage}
          page={page}
          setPage={setPage}
          totalPages={assignedTotalPages}
        />
      ) : (
        <EntityPaginatedTable
          headers={headers}
          rows={results}
          renderRow={(vehicle) =>
            renderVehicleRow(vehicle, selectedTab, partnerId)
          }
          emptyMessage="No vehicles!"
          onRowClick={(vehicle) => navigate(`/vehicles/${vehicle?._id}`)}
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

export default Vehicles;
