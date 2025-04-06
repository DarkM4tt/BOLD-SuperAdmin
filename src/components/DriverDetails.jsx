import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Dialog,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useSnackbar } from "../context/SnackbarProvider";
import { allDocumentStatus, allDriverStatus } from "../utils/enums";
import {
  useFetchDriverDetailsQuery,
  useUpdateDriverDocStatusMutation,
  useUpdateDriverStatusMutation,
} from "../features/driverApi";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import SubmittedDocumentsCard from "./common/SubmittedDocuments";
import StatusDropdown from "./common/StatusDropdown";
import QuickConnect from "./common/QuickConnect";
import RemarksModal from "./common/RemarkModal";
import InputSearchBar from "./common/InputSearchBar";
import GenerateReportButton from "./common/GenerateReportButton";
import LoadingAnimation from "./common/LoadingAnimation";
import BackArrow from "../assets/backArrow.svg";
import { useFetchRidesQuery } from "../features/rideApi";

const EntityTable = ({ rideHistory, onRideClick }) => {
  return (
    <Box
      sx={{
        paddingInline: "15px",
        paddingBlock: "30px",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        borderRadius: "8px",
      }}
    >
      <p className="font-redhat font-semibold text-2xl">Ride history</p>
      <TableContainer sx={{ maxHeight: "550px", overflowY: "auto" }}>
        <Table stickyHeader>
          <TableHead
            sx={{
              "& .MuiTableCell-root": {
                backgroundColor: "#EEEEEE",
                fontWeight: "400",
                fontSize: "16px",
                borderBottom: "none",
              },
              "& .MuiTableCell-root:first-of-type": {
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
              },
              "& .MuiTableCell-root:last-of-type": {
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              },
            }}
          >
            <TableRow>
              {["User", "Vehicle", "Status", "Service type"].map((header) => (
                <TableCell key={header}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rideHistory?.length > 0 ? (
              rideHistory.map((ride) => (
                <TableRow
                  key={ride._id}
                  sx={{
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                  onClick={() => onRideClick(ride?._id)}
                >
                  <TableCell>
                    {ride?.customer_info?.full_name || "No name"}
                  </TableCell>
                  <TableCell>
                    {ride?.vehicle_info?.vin || "Not known!"}
                  </TableCell>
                  <TableCell>{ride?.status || "Not known!"}</TableCell>
                  <TableCell>{ride?.ride_service || "Not known!"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <p className="text-red-400 text-lg font-bold mt-8">
                    No rides yet!
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const DriverDetails = ({ onRideClick }) => {
  const params = useParams();
  const { driverId } = params;
  const {
    data: driverData,
    error,
    isLoading,
  } = useFetchDriverDetailsQuery(driverId);
  const { data: ridesData } = useFetchRidesQuery(driverId);
  const [updateDriverDocStatus, { isLoading: isUpdatingDocStatus }] =
    useUpdateDriverDocStatusMutation();
  const [updateDriverStatus] = useUpdateDriverStatusMutation();
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openRemarksModal, setOpenRemarksModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [selectedDocument, setSelectedDocument] = useState({});
  const driverDetails = driverData?.data;
  const rideHistory = ridesData?.data?.rides?.results || [];
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  const handleDriverStatusChange = async (status) => {
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
    showSnackbar(error?.data?.message || "Error in fetching details!", "error");
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
              <div className="">
                <p className="font-redhat text-xl text-[#777777]">
                  Assigned vehicle
                </p>
                <p className="font-redhat text-xl pt-2 font-semibold">
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
          <EntityTable rideHistory={rideHistory} onRideClick={onRideClick} />
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

      <Dialog
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
        sx={{
          ".MuiDialog-paper": {
            borderRadius: "50%",
            width: 500,
            height: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          },
        }}
      >
        <IconButton
          onClick={() => setOpenProfileModal(false)}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
          }}
        >
          <CloseIcon />
        </IconButton>
        <img
          src={driverDetails?.profile_pic}
          alt="driver-pic"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      </Dialog>
    </>
  );
};

export default DriverDetails;
