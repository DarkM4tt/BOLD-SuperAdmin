import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  TextField,
} from "@mui/material";
import { allDocumentStatus, allVehicleStatus } from "../utils/enums";
import { useSnackbar } from "../context/SnackbarProvider";
import {
  useFetchVehicleDetailsQuery,
  useUpdateVehicleDocStatusMutation,
  useUpdateVehicleStatusMutation,
} from "../features/vehicleApi";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InputSearchBar from "./common/InputSearchBar";
import GenerateReportButton from "./common/GenerateReportButton";
import LoadingAnimation from "./common/LoadingAnimation";
import StatusDropdown from "./common/StatusDropdown";
import SubmittedDocumentsCard from "./common/SubmittedDocuments";
import RemarksModal from "./common/RemarkModal";
import CustomerCard from "./common/CustomerCard";
import QuickConnect from "./common/QuickConnect";
import RejectionReasonModal from "./common/RejectionReasonModal";
import BackArrow from "../assets/backArrow.svg";
import TickIcon from "../assets/tick.svg";

const VehicleDetails = () => {
  const [services, setServices] = useState({
    is_pet_friendly: false,
    is_assist: false,
    is_jumpstart: false,
    is_listing: false,
    is_bold_miles: false,
    is_rentals: false,
    is_sos: false,
    is_xl: false,
  });
  const params = useParams();
  const { vehicleId } = params;
  const {
    data: vehicleData,
    error,
    isLoading,
  } = useFetchVehicleDetailsQuery(vehicleId);
  const [selectedDocument, setSelectedDocument] = useState({});
  const [openRemarksModal, setOpenRemarksModal] = useState(false);
  const [openRejectionModal, setOpenRejectionModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const vehicleDetails = vehicleData?.data;
  const [updateVehicleDocStatus, { isLoading: isUpdatingDocStatus }] =
    useUpdateVehicleDocStatusMutation();
  const [updateVehicleStatus, { isLoading: isRejectingVehicle }] =
    useUpdateVehicleStatusMutation();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  const handleVehicleStatusChange = async (status) => {
    if (status === "REJECTED") {
      setRemarks("");
      setOpenRejectionModal(true);
      return;
    }
    try {
      const response = await updateVehicleStatus({
        vehicleId,
        status,
      }).unwrap();
      showSnackbar(
        response?.message || "Organization status updated successfully!",
        "success"
      );
    } catch (error) {
      showSnackbar(
        error?.data?.message || "Failed to update organization status",
        "error"
      );
    }
  };

  const handleRejectVehicle = async () => {
    try {
      const response = await updateVehicleStatus({
        vehicleId,
        status: "REJECTED",
        remarks,
      }).unwrap();
      showSnackbar(
        response?.message || "Vehicle status updated successfully!",
        "success"
      );
    } catch (error) {
      showSnackbar(
        error?.data?.message || "Failed to update vehicle status",
        "error"
      );
    } finally {
      setRemarks("");
      setOpenRejectionModal(false);
    }
  };

  const handleDocStatusChange = async (status, documentId) => {
    if (status !== "APPROVED") {
      const document = vehicleDetails.documents?.find(
        (doc) => doc._id === documentId
      );
      const updatedDocument = { ...document, status };
      setSelectedDocument(updatedDocument);
      setOpenRemarksModal(true);
      return;
    }

    try {
      const response = await updateVehicleDocStatus({
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
      const response = await updateVehicleDocStatus({
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

  useEffect(() => {
    if (vehicleDetails) {
      setServices({
        is_pet_friendly: vehicleDetails.is_pet_friendly || false,
        is_assist: vehicleDetails.is_assist || false,
        is_jumpstart: vehicleDetails.is_jumpstart || false,
        is_listing: vehicleDetails.is_listing || false,
        is_bold_miles: vehicleDetails.is_bold_miles || false,
        is_rentals: vehicleDetails.is_rentals || false,
        is_sos: vehicleDetails.is_sos || false,
        is_xl: vehicleDetails.is_xl || false,
      });
    }
  }, [vehicleDetails]);

  const handleChange = (event) => {
    setServices({
      ...services,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSave = () => {
    console.log("Selected services:", services);
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
      <div className="flex justify-between items-center font-redhat text-base font-semibold ">
        <span className="text-gray">{"> Vehicle"}</span>
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
        <div className="flex items-center gap-6 pt-8">
          <GenerateReportButton />
          <StatusDropdown
            allStatus={allVehicleStatus}
            currentStatus={vehicleDetails?.status}
            onEntityStatusChange={handleVehicleStatusChange}
          />
        </div>
      </div>

      {/* Info Card */}
      <div className=" p-6 rounded-lg bg-white mt-8">
        <div className="flex justify-between pb-11 border-b border-[#DDDDDD] ">
          <div className="flex gap-8">
            <div className="">
              {vehicleDetails?.vehicle_image && (
                <img
                  src={vehicleDetails?.vehicle_image}
                  alt="car-icon"
                  className="w-32"
                />
              )}
            </div>
            <div className="">
              <p className="font-sans text-2xl font-semibold flex items-center">
                {vehicleDetails?.brand_name} {vehicleDetails?.vehicle_model}
                <span className=" pl-4 text-base text-[#777777] underline font-sans">
                  ABC Company Ltd &gt;&gt;
                </span>
              </p>
              <div className="mt-2 flex gap-2 items-center">
                <span>
                  <DirectionsCarIcon fontSize="small" />
                </span>

                <p className="font-sans text-base text-[#777777]">
                  {vehicleDetails?.vin || (
                    <p className="text-red-400 text-sm font-bold">
                      VIN not known
                    </p>
                  )}
                </p>
              </div>
              <div className="mt-2 flex gap-2 items-center font-semibold">
                Ride Type:
                <p className="font-sans text-base text-[#777777] font-medium">
                  {vehicleDetails?.ride_type_category?.type || (
                    <p className="text-red-400 text-sm font-bold">
                      Ride type not known
                    </p>
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="">
            <p className="font-semibold text-2xl">TVDE Applicable</p>
            <div className="flex gap-2 items-center mt-4">
              <img src={TickIcon} alt="TickIcon" />
              <p className="font-semibold text-2xl">Yes</p>
              <p className="underline font-semibold text-base">Change status</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-6 items-center pt-4">
          <div className="flex items-center gap-8 flex-grow">
            <div className="">
              <p className="font-redhat text-xl text-[#777777] font-normal">
                Fuel card
              </p>
              <p className="font-semibold text-2xl pt-2"> Gasoline85 </p>
            </div>
            <p className="font-redhat font-bold text-xl text-[#344BFD]">
              Total Credit
            </p>
            <div className="h-4 rounded-3xl bg-[#EEEEEE] flex-grow relative ">
              <div className="h-4 rounded-3xl bg-[#344BFD] absolute w-[82%]"></div>
            </div>
          </div>
          <p className="font-redhat font-bold text-xl text-[#344BFD]">€ 2200</p>
        </div>
      </div>

      {/* Cards */}
      <div className="flex justify-between pt-8">
        <div className="w-4/6 flex flex-col gap-4">
          <div className="px-4 py-6 bg-white rounded-lg">
            {/* Title and Save Button */}
            <div className="flex justify-between">
              <p className="font-semibold font-redhat text-2xl">
                Covering services
              </p>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  textTransform: "none",
                  fontSize: "14px",
                  borderRadius: "8px",
                }}
                onClick={handleSave}
                disabled={true}
              >
                Save changes
              </Button>
            </div>

            {/* Checkboxes */}
            <div className="flex justify-between pt-10">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={services?.is_pet_friendly}
                    onChange={handleChange}
                    name="is_pet_friendly"
                    sx={{
                      color: "#777777",
                      "&.Mui-checked": {
                        color: "#18C4B8",
                      },
                    }}
                  />
                }
                label="Pet friendly"
                className="text-gray-800 text-sm"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={services?.is_jumpstart}
                    onChange={handleChange}
                    name="jumpstart"
                    sx={{
                      color: "#777777",
                      "&.Mui-checked": {
                        color: "#18C4B8",
                      },
                    }}
                  />
                }
                label="Jumpstart"
                className="text-gray-800 text-sm"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={services?.is_listing}
                    onChange={handleChange}
                    name="is_listing"
                    sx={{
                      color: "#777777",
                      "&.Mui-checked": {
                        color: "#18C4B8",
                      },
                    }}
                  />
                }
                label="Listing"
                className="text-gray-800 text-sm"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={services?.is_bold_miles}
                    onChange={handleChange}
                    name="is_bold_miles"
                    sx={{
                      color: "#777777",
                      "&.Mui-checked": {
                        color: "#18C4B8",
                      },
                    }}
                  />
                }
                label="BOLD Miles"
                className="text-gray-800 text-sm"
              />
            </div>

            <p className="font-semibold font-redhat text-2xl mt-8">
              Covering sectors
            </p>
            <div className="flex justify-between mt-8">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={services?.is_assist}
                    onChange={handleChange}
                    name="is_assist"
                    sx={{
                      color: "#777777",
                      "&.Mui-checked": {
                        color: "#18C4B8",
                      },
                    }}
                  />
                }
                label="Assist"
                className="text-gray-800 text-sm"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={services?.is_rentals}
                    onChange={handleChange}
                    name="is_rentals"
                    sx={{
                      color: "#777777",
                      "&.Mui-checked": {
                        color: "#18C4B8",
                      },
                    }}
                  />
                }
                label="Rentals"
                className="text-gray-800 text-sm"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={services?.is_sos}
                    onChange={handleChange}
                    name="is_sos"
                    sx={{
                      color: "#777777",
                      "&.Mui-checked": {
                        color: "#18C4B8",
                      },
                    }}
                  />
                }
                label="SoS"
                className="text-gray-800 text-sm"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={services?.is_xl}
                    onChange={handleChange}
                    name="is_xl"
                    sx={{
                      color: "#777777",
                      "&.Mui-checked": {
                        color: "#18C4B8",
                      },
                    }}
                  />
                }
                label="XL"
                className="text-gray-800 text-sm"
              />
            </div>
          </div>

          <div className="bg-white w-full h-fit p-4 rounded-[8px] flex flex-col gap-2">
            {vehicleDetails?.assignment ? (
              <>
                <div className="font-redhat flex justify-between items-center">
                  <p className="font-redHat font-semibold text-2xl">
                    Current driver
                  </p>
                  <Button
                    variant="outlined"
                    sx={{
                      backgroundColor: "white",
                      color: "black",
                      textTransform: "none",
                      fontSize: "14px",
                      borderRadius: "8px",
                      border: "1px solid black",
                    }}
                    onClick={() =>
                      navigate(
                        `/drivers/${vehicleDetails?.assignment?.driver?.driver_id}`
                      )
                    }
                  >
                    View Profile
                  </Button>
                </div>
                <CustomerCard
                  image={vehicleDetails?.assignment?.driver?.profile_pic}
                  name={vehicleDetails?.assignment?.driver?.full_name}
                  email={vehicleDetails?.assignment?.driver?.email}
                  contact={vehicleDetails?.assignment?.driver?.phone}
                  rating={4}
                />
                <TextField
                  id="fuel-card-name"
                  placeholder="Assign another driver"
                  variant="outlined"
                  size="small"
                  // value={formData.cardName}
                  // onChange={(e) => handleChange("cardName", e.target.value)}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <ExpandMoreIcon sx={{ color: "black" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            ) : (
              <p className="text-lg font-bold text-red-400">
                No driver assigned yet!
              </p>
            )}
          </div>
        </div>

        {/* Right Cards */}
        <div className="w-[30%] flex flex-col gap-8">
          <SubmittedDocumentsCard
            handleRemarksClick={handleRemarksClick}
            entityDocuments={vehicleDetails?.documents}
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

      <RejectionReasonModal
        remarks={remarks}
        setRemarks={setRemarks}
        buttonLoading={isRejectingVehicle}
        open={openRejectionModal}
        handleClose={() => {
          setRemarks("");
          setOpenRejectionModal(false);
        }}
        handleReject={handleRejectVehicle}
      />
    </>
  );
};

export default VehicleDetails;
