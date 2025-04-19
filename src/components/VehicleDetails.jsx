import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { allDocumentStatus, allVehicleStatus } from "../utils/enums";
import { useSnackbar } from "../context/SnackbarProvider";
import { getCarType } from "../utils/constants";
import {
  useFetchRideCategoriesQuery,
  useFetchRideTypeAssignmentsQuery,
} from "../features/rideApi";
import {
  useAssignRideCategoryMutation,
  useFetchVehicleDetailsQuery,
  useUpdateVehicleDocStatusMutation,
  useUpdateVehicleStatusMutation,
} from "../features/vehicleApi";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AddRideTypeModal from "./AddRideTypeModal";
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
import SmallTickIcon from "../assets/smallTick.svg";

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
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const [selectedDocument, setSelectedDocument] = useState({});
  const [openRemarksModal, setOpenRemarksModal] = useState(false);
  const [openRejectionModal, setOpenRejectionModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [openRideTypeModal, setOpenRideTypeModal] = useState(false);

  const { vehicleId } = params;
  const {
    data: vehicleData,
    error,
    isLoading,
  } = useFetchVehicleDetailsQuery(vehicleId);
  const vehicleDetails = vehicleData?.data;
  const categoryId = vehicleDetails?.ride_type_category?.type_id;
  const { data: rideTypesData } = useFetchRideCategoriesQuery();
  const rideTypes = rideTypesData?.data?.rideTypeCategories?.results;
  const { data: rideTypesAssignmentsData } = useFetchRideTypeAssignmentsQuery(
    categoryId,
    {
      skip: !categoryId,
    }
  );
  const rideTypesAssignments =
    rideTypesAssignmentsData?.data?.rideTypeAssignments?.results[0]?.ride_types;

  const [updateVehicleDocStatus, { isLoading: isUpdatingDocStatus }] =
    useUpdateVehicleDocStatusMutation();
  const [updateVehicleStatus, { isLoading: isRejectingVehicle }] =
    useUpdateVehicleStatusMutation();
  const [assignRideCategory, { isLoading: isAssigning }] =
    useAssignRideCategoryMutation();

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

  const handleRemarksClick = (document) => {
    setSelectedDocument(document);
    setOpenRemarksModal(true);
  };

  const handleAssignRideType = async (type_id, type) => {
    try {
      const response = await assignRideCategory({
        vehicleId,
        type_id,
        type,
      }).unwrap();
      showSnackbar(
        response?.message || "Ride type assigned successfully!",
        "success"
      );
      if (response?.success) {
        setOpenRideTypeModal(false);
      }
    } catch (error) {
      showSnackbar(
        error?.data?.message || "Failed to assign ride type",
        "error"
      );
    }
  };

  if (isLoading) return <LoadingAnimation width={500} height={500} />;

  if (error) {
    return (
      <p className="text-lg font-bold font-redhat text-red-400">
        {error?.data?.message || "Error in fetching details!"}
      </p>
    );
  }

  console.log(rideTypesAssignments);

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
                {vehicleDetails?.organization_id && (
                  <span
                    className=" pl-4 text-base text-[#777777] underline font-sans cursor-pointer"
                    onClick={() =>
                      navigate(`/partners/${vehicleDetails?.organization_id}`)
                    }
                  >
                    ABC Company Ltd &gt;&gt;
                  </span>
                )}
              </p>
              <div className="mt-2 flex gap-2 items-center">
                <span>
                  <DirectionsCarIcon fontSize="small" sx={{ color: "gray" }} />
                </span>

                <p className="font-sans text-base text-[#777777]">
                  {vehicleDetails?.vin || (
                    <p className="text-red-400 text-sm font-bold">
                      VIN not known
                    </p>
                  )}
                </p>
              </div>
              <div className="mt-2 flex gap-8 items-center font-semibold">
                <p className="font-sans text-base font-semibold">
                  Ride Category:{" "}
                  {vehicleDetails?.ride_type_category?.type || (
                    <span className="text-red-400 text-sm font-bold">
                      Not assigned yet!
                    </span>
                  )}
                </p>
                {vehicleDetails?.ride_type_category?.type && (
                  <p className="font-sans text-base font-semibold">
                    Car type:{" "}
                    {vehicleDetails?.ride_type_category?.type &&
                      getCarType(vehicleDetails?.ride_type_category?.type)}
                  </p>
                )}
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
            <p className="font-semibold font-redhat text-2xl">Services</p>

            {/* Checkboxes */}
            <div className="flex justify-between mt-10">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={services?.is_pet_friendly}
                    onChange={handleChange}
                    name="pet_friendly"
                    sx={{
                      color: "#777777",
                      "&.Mui-checked": {
                        color: "#18C4B8",
                      },
                    }}
                  />
                }
                label="Pet friendly"
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
                    name="listing"
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
                    name="bold_miles"
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

            <div className="flex justify-between items-center mt-12">
              <p className="font-semibold font-redhat text-2xl">
                Selected ride category
              </p>
              <p
                className="font-redhat font-semibold text-lg underline cursor-pointer"
                onClick={() => setOpenRideTypeModal(true)}
              >
                {vehicleDetails?.ride_type_category?.type ? "Change" : "+ Add"}
              </p>
            </div>

            <p className="flex gap-4 font-redhat font-semibold text-base mt-8">
              {vehicleDetails?.ride_type_category?.type && (
                <img src={SmallTickIcon} alt="SmallTickIcon" />
              )}
              {vehicleDetails?.ride_type_category?.type || "Not assigned yet!"}
            </p>

            <div className="flex gap-10 mt-12 items-center flex-wrap">
              {rideTypesAssignments?.length > 0 ? (
                rideTypesAssignments.map((rideType) => (
                  <div className="flex items-center" key={rideType._id}>
                    <Checkbox
                      checked={true}
                      name="check-box"
                      sx={{
                        color: "#777777",
                        "&.Mui-checked": {
                          color: "#18C4B8",
                        },
                      }}
                    />
                    <p className="font-redhat font-normal text-base">
                      {rideType?.name
                        ? rideType?.name
                            ?.toLowerCase()
                            ?.split(" ")
                            ?.map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            ?.join(" ")
                        : "Null!"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-lg font-bold text-red-400">
                  No ride types available!
                </p>
              )}
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
                      fontWeight: "bold",
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
                    View Profile {">>"}
                  </Button>
                </div>
                <CustomerCard
                  image={vehicleDetails?.assignment?.driver?.profile_pic}
                  name={vehicleDetails?.assignment?.driver?.full_name}
                  email={vehicleDetails?.assignment?.driver?.email}
                  contact={vehicleDetails?.assignment?.driver?.phone}
                  rating={4}
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

      <AddRideTypeModal
        rideTypes={rideTypes}
        open={openRideTypeModal}
        handleClose={() => setOpenRideTypeModal(false)}
        handleAssignRideType={handleAssignRideType}
        isLoading={isAssigning}
      />
    </>
  );
};

export default VehicleDetails;
