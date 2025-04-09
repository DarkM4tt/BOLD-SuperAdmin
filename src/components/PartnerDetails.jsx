import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { allDocumentStatus, allOrgStatus } from "../utils/enums";
import { useSnackbar } from "../context/SnackbarProvider";
import {
  useFetchOrganizationDetailsQuery,
  useUpdateOrgDocStatusMutation,
  useUpdateOrgStatusMutation,
} from "../features/organizationApi";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import BusinessIcon from "@mui/icons-material/Business";
import AcceptanceChart from "./AcceptanceChart";
import SubmittedDocumentsCard from "./common/SubmittedDocuments";
import StatusDropdown from "./common/StatusDropdown";
import RemarksModal from "./common/RemarkModal";
// import CustomDropdown from "./common/CustomDropdown";
import Locationmapcard from "./common/LocationMapCard";
import LoadingAnimation from "./common/LoadingAnimation";
import GenerateReportButton from "./common/GenerateReportButton";
import RejectionReasonModal from "./common/RejectionReasonModal";
import Warning from "../assets/redWarning.svg";
import BackArrow from "../assets/backArrow.svg";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PartnerInfo = () => {
  const chartRef = useRef(null);
  const params = useParams();
  const [gradient, setGradient] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState({});
  const [openRemarksModal, setOpenRemarksModal] = useState(false);
  const [openRejectionModal, setOpenRejectionModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const showSnackbar = useSnackbar();
  const {
    data: orgdata,
    error,
    isLoading,
  } = useFetchOrganizationDetailsQuery(params?.partnerId);
  const [updateOrgDocStatus, { isLoading: isUpdatingDocStatus }] =
    useUpdateOrgDocStatusMutation();
  const [updateOrgStatus, { isLoading: isRejectingOrg }] =
    useUpdateOrgStatusMutation();
  const navigate = useNavigate();
  const partnerDetails = orgdata?.data;

  const handleOrgStatusChange = async (status) => {
    if (status === "REJECTED") {
      setRemarks("");
      setOpenRejectionModal(true);
      return;
    }
    try {
      const response = await updateOrgStatus({
        orgId: params?.partnerId,
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

  const handleRejectOrg = async () => {
    try {
      const response = await updateOrgStatus({
        orgId: params?.partnerId,
        status: "REJECTED",
        remarks,
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
    } finally {
      setRemarks("");
      setOpenRejectionModal(false);
    }
  };

  const handleDocStatusChange = async (status, documentId) => {
    if (status !== "APPROVED") {
      const document = partnerDetails?.organizationDocuments?.find(
        (doc) => doc._id === documentId
      );
      const updatedDocument = { ...document, status };
      setSelectedDocument(updatedDocument);
      setOpenRemarksModal(true);
      return;
    }

    try {
      const response = await updateOrgDocStatus({
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
      const response = await updateOrgDocStatus({
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
    if (chartRef.current) {
      const chart = chartRef.current;
      const ctx = chart.ctx;

      // Calculate the chart's dimensions for gradient bounds
      const chartArea = chart.chartArea;
      const gradientFill = ctx.createLinearGradient(
        0, // x0
        chartArea.top, // y0
        0, // x1
        chartArea.bottom // y1
      );

      gradientFill.addColorStop(0, "rgba(59, 130, 246, 0.5)"); // Blue with opacity
      gradientFill.addColorStop(0.5, "rgba(59, 130, 246, 0.25)");
      gradientFill.addColorStop(1, "rgba(59, 130, 246, 0)");
      setGradient(gradientFill);
    }
  }, []);

  const handleRemarksClick = (document) => {
    setSelectedDocument(document);
    setOpenRemarksModal(true);
  };

  const data = {
    labels: ["May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Last 6 months",
        data: [200000, 250000, 150000, 270000, 230000],
        borderColor: "#3B82F6", // Blue line color
        backgroundColor: gradient || "rgba(59, 130, 246, 0.5)", // Fallback to solid color
        tension: 0.4, // Curved line
        fill: true,
        borderWidth: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: false, // This hides the data labels
      },
      legend: {
        display: false, // Hide legend
      },
      tooltip: {
        enabled: false, // Disable tooltips
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide gridlines
        },
        ticks: {
          display: false, // Hide x-axis numbers
        },
      },
      y: {
        grid: {
          display: false, // Hide gridlines
        },
        ticks: {
          display: false, // Hide y-axis numbers
        },
      },
    },
  };

  // const dropdownOptions = [
  //   { title: "Vehicles", value: "vehicles" },
  //   { title: "Drivers", value: "drivers" },
  // ];

  const EntityTable = () => {
    const driversData = [
      {
        id: 1,
        name: "Omar Botosh",
        assignedVehicle: "MX 019MMA9",
        totalRides: 789,
      },
      {
        id: 2,
        name: "Omar Botosh",
        assignedVehicle: "MX 019MMA9",
        totalRides: 789,
      },
      {
        id: 3,
        name: "Omar Botosh",
        assignedVehicle: "MX 019MMA9",
        totalRides: 789,
      },
      {
        id: 4,
        name: "Omar Botosh",
        assignedVehicle: "MX 019MMA9",
        totalRides: 789,
      },
      {
        id: 5,
        name: "Omar Botosh",
        assignedVehicle: "MX 019MMA9",
        totalRides: 789,
      },
      {
        id: 6,
        name: "Omar Botosh",
        assignedVehicle: "MX 019MMA9",
        totalRides: 789,
      },
      {
        id: 7,
        name: "Omar Botosh",
        assignedVehicle: "MX 019MMA9",
        totalRides: 789,
      },
      {
        id: 8,
        name: "Omar Botosh",
        assignedVehicle: "MX 019MMA9",
        totalRides: 789,
      },
      {
        id: 9,
        name: "Omar Botosh",
        assignedVehicle: "MX 019MMA9",
        totalRides: 789,
      },
    ];

    return (
      <Box
        sx={{
          marginTop: "20px",
          paddingInline: "15px",
          paddingBlock: "30px",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          borderRadius: "8px",
        }}
      >
        {/* <div className="flex justify-between"> */}
        <p className="font-redhat font-semibold text-2xl">
          List of approved vehicles
        </p>
        {/* <CustomDropdown options={dropdownOptions} />
        </div> */}
        <TableContainer>
          <Table>
            {/* Table Header */}
            <TableHead
              sx={{
                "& .MuiTableCell-root": {
                  backgroundColor: "#EEEEEE",
                  fontWeight: "600",
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
              <TableRow
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: "10px",
                  fontWeight: "400",
                  fontSize: "16px",
                }}
              >
                {["Name", "Assigned vehicle", "Total rides", "Options"].map(
                  (header) => (
                    <TableCell key={header}>{header}</TableCell>
                  )
                )}
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {driversData.map((org) => (
                <TableRow
                  key={org.id}
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  <TableCell>{org.name}</TableCell>
                  <TableCell>{org.assignedVehicle}</TableCell>
                  <TableCell>{org.totalRides}</TableCell>
                  <TableCell>
                    <button>
                      <MoreHorizIcon className="text-[#777777]" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
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
      <span className="font-redhat font-semibold text-base text-gray-700">
        {"> Partners"}
      </span>

      <img
        src={BackArrow}
        alt="BackArrow"
        className="cursor-pointer mt-8"
        onClick={() => navigate(-1)}
      />

      <div className="flex justify-between items-center mt-5">
        <div className="flex flex-col max-w-[70%]">
          <p className="font-redhat font-semibold text-2xl">
            {partnerDetails?.full_name || "No name"}
          </p>
          <p className="font-redhat font-normal text-sm text-[#777777] pt-2">
            Note: The status change will hinder the organisation operations &
            any vehicle in the organisation may not receive the ride request
            from BOLD app.{" "}
          </p>
        </div>
        <Button
          variant="outlined"
          sx={{
            textTransform: "none",
            borderColor: "black",
            color: "black",
            borderRadius: "20px",
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              borderColor: "black",
            },
          }}
        >
          Engage operations team
        </Button>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 pt-8">
          <div className="py-2 px-4 text-sm font-redhat bg-white rounded-[40px] cursor-pointer border-[1px] border-gray-200">
            List of vehicles{" "}
            <span className="pl-2">
              {" "}
              <KeyboardDoubleArrowRightIcon />
            </span>{" "}
          </div>
          <div className="py-2 px-4 text-sm font-redhat bg-white rounded-[40px] cursor-pointer border-[1px] border-gray-200">
            List of drivers{" "}
            <span className="pl-2">
              {" "}
              <KeyboardDoubleArrowRightIcon />
            </span>{" "}
          </div>
        </div>
        <div className="flex items-center gap-6 pt-8">
          <GenerateReportButton />
          <StatusDropdown
            allStatus={allOrgStatus}
            currentStatus={partnerDetails?.status}
            onEntityStatusChange={handleOrgStatusChange}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="flex justify-between pt-8">
        {/* Left Cards */}
        <div className="w-4/6">
          {/* Top Three Cards */}
          <div className="flex justify-between">
            <div
              className="w-[30%] p-6 flex gap-6 bg-white items-center rounded-lg border-b border-[#1860C4]"
              style={{ boxShadow: "4px 4px 33px 0px #0000000A" }}
            >
              <div className="p-2 rounded-lg bg-[#F6A0171F] h-fit">
                <DirectionsCarFilledIcon
                  fontSize="medium"
                  className="text-[#F6A017]"
                />
              </div>
              <div className="">
                <p className="font-redhat font-semibold text-base">
                  Total vehicles
                </p>
                <p className="pt-2 font-redhat font-bold text-2xl">
                  {partnerDetails?.totalVehicles || 0}
                </p>
                <p className="pt-2 text-sm text-[#777777]">
                  18 k+ currently <span className="text-[#18C4B8]">active</span>
                </p>
                <button
                  className="pt-3 font-redhat text-sm font-light border-b-[2px] border-black"
                  onClick={() =>
                    navigate(`/partners/${params?.partnerId}/vehicles`)
                  }
                >
                  View list
                </button>
              </div>
            </div>
            <div
              className="w-[30%] p-6 flex gap-6 bg-white items-center rounded-lg border-b border-[#1860C4]"
              style={{ boxShadow: "4px 4px 33px 0px #0000000A" }}
            >
              <div className="p-2 rounded-lg bg-[#006AFF21] h-fit">
                <BusinessIcon fontSize="medium" className="text-[#006AFF]" />
              </div>
              <div className="">
                <p className="font-redhat font-semibold text-base">
                  Total drivers
                </p>
                <p className="pt-2 font-redhat font-bold text-2xl">
                  {partnerDetails?.totalDrivers || 0}
                </p>
                <p className="pt-2 text-sm text-[#777777]">
                  including 320 rental org.
                </p>
                <button
                  className="pt-3 font-redhat text-sm font-light border-b-[2px] border-black"
                  onClick={() =>
                    navigate(`/partners/${params?.partnerId}/drivers`)
                  }
                >
                  View list
                </button>
              </div>
            </div>
            <div
              className="w-[30%] p-4 bg-white rounded-lg border-b border-[#1860C4]"
              style={{ boxShadow: "4px 4px 33px 0px #0000000A" }}
            >
              <div className="flex justify-between items-center  ">
                <p className="font-redhat font-semibold text-base">
                  Total revenue
                </p>
                <button>
                  <MoreHorizIcon className="text-[#777777]" />
                </button>
              </div>
              <div className="flex gap-2 pt-2 items-center">
                <p className="font-redhat font-bold text-2xl">€ 22.1 M</p>
                <p className="font-redhat font-semibold text-xs text-[#777777]">
                  {" "}
                  <span>
                    <TrendingUpIcon className="text-[#18C4B8] pr-2" />
                  </span>
                  2% UP
                </p>
              </div>
              <div className="mt-4 h-16">
                <Line ref={chartRef} data={data} options={options} />
              </div>
            </div>
          </div>

          {/* Bottom Three Cards */}
          <div className="flex justify-between pt-6 ">
            <div
              className="w-[30%] flex p-4 bg-white rounded-lg border-b border-[#1860C4]"
              style={{ boxShadow: "4px 4px 33px 0px #0000000A" }}
            >
              <AcceptanceChart />
            </div>
            <div
              className="w-[30%] p-6 flex gap-6 bg-white items-center rounded-lg border-b border-[#1860C4]"
              style={{ boxShadow: "4px 4px 33px 0px #0000000A" }}
            >
              <div className="p-3 rounded-lg bg-[#D20B0B14] h-fit">
                <img src={Warning} alt="Warning" />
              </div>
              <div className="">
                <p className="font-redhat font-semibold text-base">
                  Major issue reported
                </p>
                <p className="pt-2 font-redhat font-bold text-2xl">00</p>
                <p className="pt-2 text-sm text-[#777777]">
                  including all issue
                </p>
                <button className="pt-3 font-redhat text-sm font-light border-b-[2px] border-black">
                  View list
                </button>
              </div>
            </div>
            <div className="w-[30%] p-6 flex flex-col gap-2 bg-white rounded-lg border-b border-[#1860C4]">
              <p className="font-redhat font-semibold text-base">
                Pending payouts
              </p>
              <p className="font-redhat font-bold text-2xl">€ 22,1109</p>
              <p className="text-sm text-[#777777]">
                Including all the accounts
              </p>
              <button className="w-full bg-black py-2 font-redhat font-semibold text-lg text-white rounded-lg">
                {"Proceed to pay >>"}
              </button>
            </div>
          </div>

          {/* Table */}
          <EntityTable />
        </div>

        {/* Right Cards */}
        <div className="w-[30%] flex flex-col gap-4">
          <SubmittedDocumentsCard
            handleRemarksClick={handleRemarksClick}
            entityDocuments={partnerDetails?.organizationDocuments}
            status={allDocumentStatus}
            onDocStatusChange={handleDocStatusChange}
          />
          <Locationmapcard
            email={partnerDetails?.email}
            phone={partnerDetails?.phone}
            address={partnerDetails?.organizationAddress?.complete_address}
            center={partnerDetails?.organizationAddress?.location?.coordinates}
          />
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
        buttonLoading={isRejectingOrg}
        open={openRejectionModal}
        handleClose={() => {
          setRemarks("");
          setOpenRejectionModal(false);
        }}
        handleReject={handleRejectOrg}
      />
    </>
  );
};

export default PartnerInfo;
