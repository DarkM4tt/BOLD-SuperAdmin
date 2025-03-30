import { useRef, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import PinkDriverIcon from "../assets/pinkDriverIcon.svg";
import UsersIcon from "../assets/UsersIcon.svg";
import AcceptanceChart from "../components/AcceptanceChart";
import BookingGraph from "../components/BookingGraph";
import Saletypechart from "../components/SaleTypeChart";
import GenerateReportButton from "../components/common/GenerateReportButton";

ChartJS.register(
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = ({
  onMenuItemClick,
  setSelectedOrgId,
  setSelectedDriverId,
}) => {
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const ctx = chart.ctx;

      const chartArea = chart.chartArea;
      const gradientFill = ctx.createLinearGradient(
        0, // x0
        chartArea.top, // y0
        0, // x1
        chartArea.bottom // y1
      );

      gradientFill.addColorStop(0, "rgba(59, 130, 246, 0.5)");
      gradientFill.addColorStop(0.5, "rgba(59, 130, 246, 0.25)");
      gradientFill.addColorStop(1, "rgba(59, 130, 246, 0)");
      setGradient(gradientFill);
    }
  }, []);

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

  return (
    <>
      <div className="flex justify-between items-center font-redhat text-base font-semibold ">
        {"> Dashboard"}
        <div className="py-3 px-4 bg-[#EEEEEE] flex items-center gap-3 rounded-lg">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent outline-none"
          ></input>
        </div>
      </div>
      <p className="font-redhat font-semibold text-2xl pt-8">Overview</p>
      <p className="font-redhat font-normal text-sm  text-[#777777] pt-2">
        This is the overall highlights which includes everything in the BOLD
        applications.{" "}
      </p>

      <div className="flex justify-between items-center mt-8">
        <div className="flex items-center gap-4">
          <div className="py-2 px-4 text-sm font-redhat bg-white rounded-[40px]">
            622 fuel stations signup{" "}
            <span className="pl-2">
              {" "}
              <KeyboardDoubleArrowRightIcon />
            </span>{" "}
          </div>
          <div className="py-2 px-4 text-sm font-redhat bg-white rounded-[40px]">
            109 rentals signups{" "}
            <span className="pl-2">
              {" "}
              <KeyboardDoubleArrowRightIcon />
            </span>{" "}
          </div>
          <div className="py-2 px-4 text-sm font-redhat bg-white rounded-[40px]">
            221 M new users{" "}
            <span className="pl-2">
              {" "}
              <KeyboardDoubleArrowRightIcon />
            </span>{" "}
          </div>
        </div>
        <GenerateReportButton />
      </div>

      <div className="flex justify-between pt-8">
        <div className="w-4/6">
          <div className="flex justify-between ">
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
                <p className="pt-2 font-redhat font-bold text-2xl">22 k</p>
                <p className="pt-2 text-sm text-[#777777]">
                  18 k+ currently <span className="text-[#18C4B8]">active</span>
                </p>
                <button
                  className="pt-3 font-redhat text-sm font-light border-b-[2px] border-gray-600"
                  onClick={() => {
                    setSelectedOrgId(null);
                    onMenuItemClick("AllVehicles");
                  }}
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
                <img src={UsersIcon} alt="DriverIcon" />
              </div>
              <div className="">
                <p className="font-redhat font-semibold text-base">
                  Total users
                </p>
                <p className="pt-2 font-redhat font-bold text-2xl">2210</p>
                <p className="pt-2 text-sm text-[#777777]">
                  including 320 rental org.
                </p>
                <button
                  className="pt-3 font-redhat text-sm font-light border-b-[2px] border-gray-600"
                  onClick={() => onMenuItemClick("AllCustomers")}
                >
                  View list
                </button>
              </div>
            </div>
          </div>
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
              <div className="p-2 rounded-lg bg-[#deeaea] h-fit">
                <DirectionsCarFilledIcon
                  fontSize="medium"
                  className="text-[#18C4B8]"
                />
              </div>
              <div className="">
                <p className="font-redhat font-semibold text-base">
                  Total cabs booked
                </p>
                <p className="pt-2 font-redhat font-bold text-2xl">22 k</p>
                <p className="pt-2 text-sm text-[#777777]">
                  18 k+ currently ongoing
                </p>
                <button
                  className="pt-3 font-redhat text-sm font-light border-b-[2px] border-gray-600"
                  onClick={() => {
                    setSelectedDriverId(null);
                    onMenuItemClick("AllRides");
                  }}
                >
                  View list
                </button>
              </div>
            </div>
            <div
              className="w-[30%] p-6 flex gap-6 bg-white items-center rounded-lg border-b border-[#1860C4]"
              style={{ boxShadow: "4px 4px 33px 0px #0000000A" }}
            >
              <div className="p-2 rounded-lg bg-[#F50AFE21] h-fit">
                <img src={PinkDriverIcon} alt="DriverIcon" />
              </div>
              <div className="">
                <p className="font-redhat font-semibold text-base">
                  Total drivers
                </p>
                <p className="pt-2 font-redhat font-bold text-2xl">2210</p>
                <p className="pt-2 text-sm text-[#777777]">
                  including 320 rental org.
                </p>
                <button
                  className="pt-3 font-redhat text-sm font-light border-b-[2px] border-gray-600"
                  onClick={() => {
                    setSelectedOrgId(null);
                    onMenuItemClick("AllDrivers");
                  }}
                >
                  View list
                </button>
              </div>
            </div>
          </div>
          <BookingGraph />
        </div>
        <div className="w-[30%] flex flex-col gap-6">
          <div
            className=" p-4 bg-white rounded-lg "
            style={{ boxShadow: "4px 4px 33px 0px #0000000A" }}
          >
            <div className="flex justify-between items-center  ">
              <p className="font-redhat font-semibold text-base">
                Total profit made
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
            <p className="font-redhat text-base text-[#777777] pt-2">
              Including all sectors on BOLD app{" "}
            </p>
            <div className="mt-4 h-24">
              <Line ref={chartRef} data={data} options={options} />
            </div>
          </div>
          <Saletypechart />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
