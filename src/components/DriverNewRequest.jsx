import { useState } from "react";
import { allDocumentStatus } from "../utils/enums";
import { useSnackbar } from "../context/SnackbarProvider";
import { Avatar, Box, Button, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LoadingAnimation from "./common/LoadingAnimation";
import StatusDropdown from "./common/StatusDropdown";
import pdfIcon from "../assets/pdf.png";
import BackArrow from "../assets/backArrow.svg";
import RemarksModal from "./common/RemarkModal";
import DocumentModal from "./common/DocumentModal";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFetchDriverDetailsQuery,
  useUpdateDriverDocStatusMutation,
  useUpdateDriverStatusMutation,
} from "../features/driverApi";
import InputSearchBar from "./common/InputSearchBar";
import RejectionReasonModal from "./common/RejectionReasonModal";

const DriverNewRequest = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { driverId } = params;
  const {
    data: driverData,
    error,
    isLoading,
  } = useFetchDriverDetailsQuery(driverId);
  const [updateDriverDocStatus, { isLoading: isUpdatingDocStatus }] =
    useUpdateDriverDocStatusMutation();
  const [updateDriverStatus, { isLoading: isUpdatingDriverStatus }] =
    useUpdateDriverStatusMutation();
  const [openDocumentModal, setOpenDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState({});
  const [openRejectionModal, setOpenRejectionModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  const showSnackbar = useSnackbar();
  const entityDetails = driverData?.data;

  const handleOpenDocumentModal = (documentUrl, name) => {
    setSelectedDocument({ url: documentUrl, name });
    setOpenDocumentModal(true);
  };

  const handleEntityStatusChange = async (status) => {
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
      if (response?.success) {
        navigate(-1);
      }
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
      const document = entityDetails?.documents?.find(
        (doc) => doc._id === documentId
      );
      const updatedDocument = { ...document, status };
      setSelectedDocument(updatedDocument);
      setOpen(true);
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
      setOpen(false);
    }
  };

  const EntityInfoCard = () => (
    <div className="px-4 py-8 bg-white rounded-lg mb-4">
      <div className="flex items-center gap-8 border-b-[1px] border-[#e0e0e0] pb-6">
        {entityDetails?.profile_pic ? (
          <img src={entityDetails?.profile_pic} alt="OrgBig" width={70} />
        ) : (
          <Avatar sx={{ width: "5rem", height: "5rem", borderRadius: "50%" }}>
            {entityDetails?.full_name?.charAt(0)}
          </Avatar>
        )}
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-2xl">
            {entityDetails?.full_name || "No name"}
          </p>
          <div className="flex items-center text-gray gap-1">
            <p className="font-normal text-base text-gray">
              {entityDetails?.username}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-14 mt-6 pl-6">
        <p className="font-redhat font-normal text-xl text-gray">Status</p>
        <div className="flex gap-4">
          <Button
            variant="outlined"
            sx={{
              color: "#18C4B8",
              borderColor: "#18C4B8",
              textTransform: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              padding: "6px 35px",
              "&:hover": {
                borderColor: "#1AC6CD",
                backgroundColor: "rgba(26, 198, 205, 0.1)",
              },
            }}
            onClick={() => handleEntityStatusChange("APPROVED")}
          >
            {isUpdatingDriverStatus ? (
              <LoadingAnimation width={30} height={30} />
            ) : (
              "Approve and add"
            )}
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: "#D20B0B",
              borderColor: "#D20B0B",
              textTransform: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              padding: "6px 35px",
              "&:hover": {
                borderColor: "#D20B0B",
                backgroundColor: "rgba(240, 0, 0, 0.1)",
              },
            }}
            onClick={() => handleEntityStatusChange("REJECTED")}
          >
            {isUpdatingDriverStatus ? (
              <LoadingAnimation width={30} height={30} />
            ) : (
              "Reject request"
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  const SubmittedDocumentsCard = () => (
    <div className="py-8 px-6 bg-white rounded-lg">
      <p className="font-bold font-redhat text-lg mb-4">Uploaded documents</p>
      {entityDetails?.documents?.length === 0 && (
        <p className="text-lg text-red-400 font-bold">
          No documents uploaded yet!
        </p>
      )}
      {entityDetails?.documents?.map((doc, index) => (
        <Box key={index}>
          <div className="flex justify-between items-center mb-4 pt-4 pb-2">
            <div className="flex items-center">
              <div className="flex gap-2 mt-4">
                <img src={pdfIcon} alt="PDF Icon" className="w-6 h-6 mr-3" />
                <p className="font-semibold">{doc?.name}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                variant="text"
                sx={{
                  color: "black",
                  textTransform: "none",
                  fontWeight: "600",
                  "&:hover": {
                    backgroundColor: "#ffffff",
                    textDecoration: "underline",
                  },
                  textDecoration: "underline",
                }}
                onClick={() =>
                  handleOpenDocumentModal(doc?.document, doc?.name)
                }
              >
                View
              </Button>
              {!(doc?.status === "APPROVED") && (
                <Button
                  variant="text"
                  sx={{
                    color: "black",
                    textTransform: "none",
                    fontWeight: "600",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                      textDecoration: "underline",
                    },
                    textDecoration: "underline",
                  }}
                  onClick={() => {
                    setSelectedDocument(doc);
                    setOpen(true);
                  }}
                >
                  Remarks
                </Button>
              )}
              <StatusDropdown
                isNew={true}
                allStatus={allDocumentStatus}
                currentStatus={doc?.status}
                documentId={doc?._id}
                onDocStatusChange={handleDocStatusChange}
              />
            </div>
          </div>
          {index < entityDetails?.documents?.length - 1 && <Divider />}
        </Box>
      ))}
    </div>
  );

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
      <div className="flex justify-between items-center font-redhat text-base font-semibold ">
        <div className="flex gap-2 text-gray">{"> Partners"}</div>
        <InputSearchBar />
      </div>
      <img
        src={BackArrow}
        alt="BackArrow"
        className="mb-4 mt-12 cursor-pointer"
        onClick={() => navigate(-1)}
      />

      <Box className="flex flex-col gap-6 mt-8">
        <EntityInfoCard />
        <SubmittedDocumentsCard />
      </Box>

      <DocumentModal
        open={openDocumentModal}
        onClose={() => {
          setSelectedDocument(null);
          setOpenDocumentModal(false);
        }}
        documentUrl={selectedDocument?.url}
        documentName={selectedDocument?.name}
      />

      <RemarksModal
        selectedDocument={selectedDocument}
        remarks={remarks}
        setRemarks={setRemarks}
        buttonLoading={isUpdatingDocStatus}
        open={open}
        handleClose={() => {
          setSelectedDocument(null);
          setOpen(false);
        }}
        handleAddRemarks={handleAddRemarks}
      />

      <RejectionReasonModal
        remarks={remarks}
        setRemarks={setRemarks}
        buttonLoading={isUpdatingDriverStatus}
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

export default DriverNewRequest;
