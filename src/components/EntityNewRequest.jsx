import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFetchVehicleDetailsQuery,
  useUpdateVehicleDocStatusMutation,
  useUpdateVehicleStatusMutation,
} from "../features/vehicleApi";
import { useFetchRideTypesQuery } from "../features/rideApi";
import {
  useFetchOrganizationDetailsQuery,
  useUpdateOrgDocStatusMutation,
  useUpdateOrgStatusMutation,
} from "../features/organizationApi";
import { useSnackbar } from "../context/SnackbarProvider";
import { allDocumentStatus } from "../utils/enums";
import { Box, Button, Divider } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DocumentModal from "./common/DocumentModal";
import InputSearchBar from "./common/InputSearchBar";
import LoadingAnimation from "./common/LoadingAnimation";
import StatusDropdown from "./common/StatusDropdown";
import RemarksModal from "./common/RemarkModal";
import RejectionReasonModal from "./common/RejectionReasonModal";
import AddRideTypeModal from "../components/AddRideTypeModal";
import BackArrow from "../assets/backArrow.svg";
import OrgBig from "../assets/OrgBig.svg";
import pdfIcon from "../assets/pdf.png";
import TickIcon from "../assets/tick.svg";

const EntityNewRequest = () => {
  const [openDocumentModal, setOpenDocumentModal] = useState(false);
  const [openRideTypeModal, setOpenRideTypeModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState({});
  const [open, setOpen] = useState(false);
  const [openRejectionModal, setOpenRejectionModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const { vehicleId, partnerId } = params;
  const {
    data: orgData,
    error: orgError,
    isLoading: orgLoading,
  } = useFetchOrganizationDetailsQuery(partnerId, {
    skip: !partnerId,
  });
  const {
    data: vehicleData,
    error: vehicleError,
    isLoading: vehicleLoading,
  } = useFetchVehicleDetailsQuery(vehicleId, {
    skip: !vehicleId,
  });
  const { data: rideTypesData } = useFetchRideTypesQuery();
  const [updateVehicleDocStatus, { isLoading: isUpdatingVehicleDocStatus }] =
    useUpdateVehicleDocStatusMutation();
  const [updateVehicleStatus, { isLoading: isUpdatingVehicleStatus }] =
    useUpdateVehicleStatusMutation();
  const [updateOrgDocStatus, { isLoading: isUpdatingOrgDocStatus }] =
    useUpdateOrgDocStatusMutation();
  const [updateOrgStatus, { isLoading: isUpdatingOrgStatus }] =
    useUpdateOrgStatusMutation();
  const showSnackbar = useSnackbar();
  const rideTypes = rideTypesData?.data?.rideTypes?.results;
  const entityDetails = vehicleId ? vehicleData?.data : orgData?.data;

  const entityDocuments = useCallback(() => {
    if (vehicleId) return vehicleData?.data?.documents;
    if (partnerId) return entityDetails?.organizationDocuments;
    return [];
  }, [
    vehicleId,
    vehicleData?.data?.documents,
    partnerId,
    entityDetails?.organizationDocuments,
  ]);

  const handleOpenDocumentModal = (documentUrl, name) => {
    setSelectedDocument({ url: documentUrl, name });
    setOpenDocumentModal(true);
  };

  const handleEntityStatusChange = async (status) => {
    if (vehicleId && status === "APPROVED") {
      setOpenRideTypeModal(true);
      return;
    }

    if (status === "REJECTED") {
      setRemarks("");
      setOpenRejectionModal(true);
      return;
    }

    try {
      const response = await (vehicleId
        ? updateVehicleStatus({
            vehicleId,
            status,
          }).unwrap()
        : await updateOrgStatus({
            orgId: partnerId,
            status,
          }).unwrap());
      showSnackbar(
        response?.message || "Organization status updated successfully!",
        "success"
      );
      if (response?.success) {
        navigate(-1);
      }
    } catch (error) {
      showSnackbar(
        error?.data?.message || "Failed to update organization status",
        "error"
      );
    }
  };

  const handleReject = async () => {
    try {
      const response = await (partnerId
        ? updateOrgStatus({
            orgId: partnerId,
            status: "REJECTED",
            remarks,
          }).unwrap()
        : updateVehicleStatus({
            vehicleId,
            status: "REJECTED",
            remarks,
          }).unwrap());
      showSnackbar(
        response?.message || "Organization status updated successfully!",
        "success"
      );
      if (response?.success) {
        navigate(-1);
      }
    } catch (error) {
      showSnackbar(
        error?.data?.message || "Failed to update organization status",
        "error"
      );
    } finally {
      setRemarks("");
      setOpenRejectionModal(false);
    }
  };

  const handleDocStatusChange = async (status, documentId) => {
    if (status !== "APPROVED") {
      const document = entityDocuments()?.find((doc) => doc._id === documentId);
      const updatedDocument = { ...document, status };
      setSelectedDocument(updatedDocument);
      setOpen(true);
      return;
    }

    try {
      const response = await (vehicleId
        ? updateVehicleDocStatus({
            documentId,
            status,
          }).unwrap()
        : updateOrgDocStatus({
            documentId,
            status,
          }).unwrap());
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
      const response = await (vehicleId
        ? updateVehicleDocStatus({
            documentId: selectedDocument?._id,
            status: selectedDocument?.status,
            remarks,
          }).unwrap()
        : updateOrgDocStatus({
            documentId: selectedDocument?._id,
            status: selectedDocument?.status,
            remarks,
          }).unwrap());
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
        {partnerId ? (
          <img src={OrgBig} alt="PartnerIcon" className="w-30 mx-4" />
        ) : (
          <img
            src={entityDetails?.vehicle_image}
            alt="VehicleIcon"
            className="w-32 mx-4"
          />
        )}
        <div className="flex flex-col gap-2">
          {partnerId ? (
            <p className="font-semibold text-2xl">
              {entityDetails?.full_name || "No name"}
            </p>
          ) : (
            <p className="font-semibold text-2xl">
              {entityDetails?.brand_name} {entityDetails?.vehicle_model}
            </p>
          )}
          <div className="flex items-center text-gray gap-1">
            {partnerId ? (
              <LocationOnIcon fontSize="small" />
            ) : (
              <DirectionsCarIcon fontSize="small" />
            )}
            <p className="font-normal text-base text-gray">
              {partnerId
                ? entityDetails?.organizationAddress?.complete_address ||
                  "Address not provided yet!"
                : entityDetails?.vin || "VIN not provided!"}
            </p>
          </div>
        </div>
        {vehicleId && (
          <div className="flex flex-col ml-auto">
            <p className="font-semibold text-2xl">TVDE Applicable</p>
            <div className="flex gap-2 items-center mt-4">
              <img src={TickIcon} alt="TickIcon" />
              <p className="font-semibold text-2xl">Yes</p>
              <p className="font-normal text-sm ml-4">Validity : 2025</p>
            </div>
          </div>
        )}
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
            {isUpdatingOrgStatus || isUpdatingVehicleStatus ? (
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
            {isUpdatingOrgStatus || isUpdatingVehicleStatus ? (
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
      {entityDocuments()?.length === 0 && (
        <p className="text-lg text-red-400 font-bold">
          No documents uploaded yet!
        </p>
      )}
      {entityDocuments()?.map((doc, index) => (
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
          {index < entityDocuments()?.length - 1 && <Divider />}
        </Box>
      ))}
    </div>
  );

  if (vehicleLoading || orgLoading)
    return <LoadingAnimation width={500} height={500} />;

  if (vehicleError || orgError) {
    showSnackbar(
      (vehicleError ? vehicleError : orgError)?.data?.message ||
        "Error in fetching details!",
      "error"
    );
    return (
      <p className="text-lg font-bold font-redhat text-red-400">
        {(vehicleError ? vehicleError : orgError)?.data?.message ||
          "Error in fetching details!"}
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
        buttonLoading={isUpdatingOrgDocStatus || isUpdatingVehicleDocStatus}
        open={open}
        handleClose={() => {
          setSelectedDocument(null);
          setOpen(false);
        }}
        handleAddRemarks={handleAddRemarks}
      />

      <AddRideTypeModal
        rideTypes={rideTypes}
        open={openRideTypeModal}
        handleClose={() => setOpenRideTypeModal(false)}
        vehicleId={vehicleId}
      />

      <RejectionReasonModal
        remarks={remarks}
        setRemarks={setRemarks}
        buttonLoading={isUpdatingOrgStatus || isUpdatingVehicleStatus}
        open={openRejectionModal}
        handleClose={() => {
          setRemarks("");
          setOpenRejectionModal(false);
        }}
        handleReject={handleReject}
      />
    </>
  );
};

export default EntityNewRequest;
