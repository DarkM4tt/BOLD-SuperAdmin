import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Dialog, IconButton, TableCell } from "@mui/material";
import { useSnackbar } from "../context/SnackbarProvider";
import { allDocumentStatus, allDriverStatus } from "../utils/enums";
import {
  useFetchDriverDetailsQuery,
  useUpdateDriverDocStatusMutation,
  useUpdateDriverStatusMutation,
} from "../features/driverApi";
import { useFetchRidesQuery } from "../features/rideApi";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import StarIcon from "@mui/icons-material/Star";
import SubmittedDocumentsCard from "./common/SubmittedDocuments";
import ProfileModal from "./common/ProfileModal";
import StatusDropdown from "./common/StatusDropdown";
import QuickConnect from "./common/QuickConnect";
import RemarksModal from "./common/RemarkModal";
import InputSearchBar from "./common/InputSearchBar";
import GenerateReportButton from "./common/GenerateReportButton";
import LoadingAnimation from "./common/LoadingAnimation";
import EntityPaginatedTable from "./common/EntityPaginatedTable";
import RejectionReasonModal from "./common/RejectionReasonModal";
import BackArrow from "../assets/backArrow.svg";

const headers = ["User", "Vehicle", "Status", "Service type"];

const renderRideRow = (ride) => {
  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;
  return (
    <>
      <TableCell>{ride?.customer_info?.full_name || "No name"}</TableCell>
      <TableCell>{ride?.vehicle_info?.vin || "Not known!"}</TableCell>
      <TableCell>
        {ride?.status ? (
          capitalize(ride.status)
        ) : (
          <p className="text-red-500">Not known!</p>
        )}
      </TableCell>
      <TableCell>
        {ride?.ride_service ? (
          capitalize(ride.ride_service)
        ) : (
          <p className="text-red-500">Not known!</p>
        )}
      </TableCell>
    </>
  );
};

const DriverDetails = () => {
  const [page, setPage] = useState(1);
  const params = useParams();
  const { driverId } = params;
  const {
    data: driverData,
    error,
    isLoading,
  } = useFetchDriverDetailsQuery(driverId);
  const { data: ridesData } = useFetchRidesQuery({ driverId, page });
  const {
    results = [],
    totalPages,
    isNextPage,
    isPreviousPage,
  } = ridesData?.data?.rides || {};
  const [updateDriverDocStatus, { isLoading: isUpdatingDocStatus }] =
    useUpdateDriverDocStatusMutation();
  const [updateDriverStatus, { isLoading: isRejectingDriver }] =
    useUpdateDriverStatusMutation();
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openRemarksModal, setOpenRemarksModal] = useState(false);
  const [openRejectionModal, setOpenRejectionModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [selectedDocument, setSelectedDocument] = useState({});
  const driverDetails = driverData?.data;
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  const handleDriverStatusChange = async (status) => {
    if (status === "REJECTED") {
      setRemarks("");
      setOpenRejectionModal(true);
      return;
    }
    try {
      const response = await updateDriverStatus({
        driverId,
        status,
      }).unwrap();
      showSnackbar(
        response?.message || "Driver status updated successfully!",
        "success"
      );
    } catch (error) {
      showSnackbar(
        error?.data?.message || "Failed to update driver status",
        "error"
      );
    }
  };

  const handleRejectDriver = async () => {
    try {
      const response = await updateDriverStatus({
        driverId,
        status: "REJECTED",
        remarks,
      }).unwrap();
      showSnackbar(
        response?.message || "Driver status updated successfully!",
        "success"
      );
    } catch (error) {
      showSnackbar(
        error?.data?.message || "Failed to update driver status",
        "error"
      );
    } finally {
      setRemarks("");
      setOpenRejectionModal(false);
    }
  };

  const handleDocStatusChange = async (status, documentId) => {
    if (status !== "APPROVED") {
      const document = driverDetails?.documents?.find(
        (doc) => doc._id === documentId
      );
      const updatedDocument = { ...document, status };
      setSelectedDocument(updatedDocument);
      setOpenRemarksModal(true);
      return;
    }

    try {
      const response = await updateDriverDocStatus({
        documentId,
        status,
      }).unwrap();
      showSnackbar(
        response?.message || "Document status updated successfully!",
        "success"
      );
    } catch (error) {
      showSnackbar(
        error?.data?.message || "Failed to update document status",
        "error"
      );
    }
  };

  const handleAddRemarks = async () => {
    try {
      const response = await updateDriverDocStatus({
        documentId: selectedDocument?._id,
        status: selectedDocument?.status,
        remarks,
      }).unwrap();
      showSnackbar(
        response?.message || "Document status updated successfully!",
        "success"
      );
    } catch (error) {
      showSnackbar(
        error?.data?.message || "Failed to update document status",
        "error"
      );
    } finally {
      setRemarks("");
      setSelectedDocument(null);
      setOpenRemarksModal(false);
    }
  };

  const handleRemarksClick = (document) => {
    setSelectedDocument(document);
    setOpenRemarksModal(true);
  };

  if (isLoading) return <LoadingAnimation width={500} height={500} />;

  if (error) {
    return (
      <p className="text-lg font-bold font-redhat text-red-400">
        {error?.data?.message || "Error in fetching details!"}
      </p>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center font-redhat text-base font-semibold mb-8">
        {"> Partners"}
        <InputSearchBar />
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src={BackArrow}
            alt="BackArrow"
            className="mb-4 cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </div>
        <div className="flex items-center gap-6">
          <GenerateReportButton />
          <StatusDropdown
            allStatus={allDriverStatus}
            currentStatus={driverDetails?.status}
            onEntityStatusChange={handleDriverStatusChange}
          />
        </div>
      </div>

      <div className="p-6 rounded-lg bg-white mt-8">
        <div className="flex justify-between pb-11 border-b border-[#DDDDDD]">
          <div>
            <div className="flex gap-4">
              <div className="">
                {driverDetails?.profile_pic ? (
                  <img
                    src={driverDetails?.profile_pic}
                    alt="driver-pic"
                    className="w-20 h-20 rounded-full cursor-pointer"
                    onClick={() => setOpenProfileModal(true)}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      fontSize: 32,
                      cursor: "pointer",
                    }}
                  >
                    {driverDetails?.full_name?.charAt(0)}
                  </Avatar>
                )}
              </div>
              <div className="">
                <p className="font-sans text-2xl font-semibold flex items-center">
                  {driverDetails?.full_name}{" "}
                  <span className=" pl-4 text-base text-[#777777] underline font-sans">
                    ABC Company Ltd &gt;&gt;
                  </span>
                </p>
                <div className="pt-2 flex gap-4">
                  <p className="font-sans text-base text-[#777777] flex gap-2 items-center">
                    <span>
                      <EmailIcon fontSize="small" />
                    </span>
                    {driverDetails?.email}
                  </p>
                  <p className="font-sans text-base text-[#777777] flex gap-2 items-center underline">
                    <span>
                      <CallIcon fontSize="small" />
                    </span>
                    {driverDetails?.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {driverDetails?.rating && (
            <div className="">
              <p className="font-redhat text-xl text-[#777777]">
                Customer rating
              </p>
              <p className="pt-2 font-redhat font-bold text-xl text-[#18C4B8] text-right">
                <span className="text-[#FBDB0B] pr-2">
                  <StarIcon />
                </span>
                {driverDetails?.rating}/5
              </p>
            </div>
          )}
        </div>
        {driverDetails?.vehicle !== null ? (
          <div className="flex justify-between gap-6 items-center pt-4">
            {driverDetails?.vehicle?.vehicle_image && (
              <img
                src={driverDetails?.vehicle?.vehicle_image}
                alt="partycar"
                className="w-32"
              />
            )}
            <div className="flex items-center gap-8 flex-grow">
              <div
                className="cursor-pointer"
                onClick={() =>
                  navigate(`/vehicles/${driverDetails?.vehicle?.vehicle_id}`)
                }
              >
                <p className="font-redhat text-xl text-[#777777]">
                  Assigned vehicle
                </p>
                <p className="font-redhat text-xl pt-2 font-semibold underline">
                  {" "}
                  {driverDetails?.vehicle?.vin}{" "}
                </p>
              </div>
              <p className="font-redhat font-bold text-xl text-[#344BFD]">
                {driverDetails?.acceptance_rate}%
              </p>
              <div className="h-4 rounded-3xl bg-[#EEEEEE] flex-grow relative ">
                <div className="h-4 rounded-3xl bg-[#344BFD] absolute w-[82%]"></div>
              </div>
            </div>
            <p className="font-redhat font-semibold text-xl text-[#777777]">
              Acceptance ratio
            </p>
          </div>
        ) : (
          <p className="mt-2 text-red-400 text-lg font-semibold">
            No vehicle assigned yet!
          </p>
        )}
      </div>

      {/* Cards */}
      <div className="flex justify-between pt-8">
        <div className="w-4/6">
          <div className="bg-white p-2 rounded-lg flex flex-col">
            <p className="font-redhat font-semibold text-2xl p-2">
              Ride history
            </p>
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
              maxHeight="620px"
            />
          </div>
        </div>

        <div className="w-[30%] flex flex-col gap-8">
          <SubmittedDocumentsCard
            handleRemarksClick={handleRemarksClick}
            entityDocuments={driverDetails?.documents}
            status={allDocumentStatus}
            onDocStatusChange={handleDocStatusChange}
          />
          <QuickConnect />
        </div>
      </div>

      <RemarksModal
        selectedDocument={selectedDocument}
        remarks={remarks}
        setRemarks={setRemarks}
        buttonLoading={isUpdatingDocStatus}
        open={openRemarksModal}
        handleClose={() => {
          setSelectedDocument(null);
          setRemarks("");
          setOpenRemarksModal(false);
        }}
        handleAddRemarks={handleAddRemarks}
      />

      {driverDetails?.profile_pic && (
        <ProfileModal
          openProfileModal={openProfileModal}
          setOpenProfileModal={setOpenProfileModal}
          imageUrl={driverDetails?.profile_pic}
        />
      )}

      <RejectionReasonModal
        remarks={remarks}
        setRemarks={setRemarks}
        buttonLoading={isRejectingDriver}
        open={openRejectionModal}
        handleClose={() => {
          setRemarks("");
          setOpenRejectionModal(false);
        }}
        handleReject={handleRejectDriver}
      />
    </>
  );
};

export default DriverDetails;
