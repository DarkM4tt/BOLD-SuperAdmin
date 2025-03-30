import React from "react";
import { Doughnut } from "react-chartjs-2";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

ChartJS.register(ArcElement, Tooltip, Legend);

const Saletypechart = () => {
  const data = {
    labels: ["Cabs booked", "Customer engagement"],
    datasets: [
      {
        data: [80.7, 9.2],
        backgroundColor: ["#A78BFA", "#34D399"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    rotation: -90,
    responsive: true,
    maintainAspectRatio: true,
    circumference: 180,
    cutout: "60%",

    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
    },
  };

  return (
    <div
      className="px-4 py-6 bg-white rounded-lg flex-grow"
      style={{ boxShadow: "4px 4px 33px 0px #0000000A" }}
    >
      <div className="flex justify-between items-center  ">
        <p className="font-redhat font-semibold text-base">Sale type</p>
        <button>
          <MoreHorizIcon className="text-[#777777]" />
        </button>
      </div>
      <div className="relative px-5">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 top-[25%] flex flex-col items-center justify-center">
          <p className="font-sans text-xl text-[#777777]">Bookings</p>
          <p className="font-redhat text-2xl font-semibold pt-1">92.6%</p>
        </div>
      </div>
      <div className="flex justify-between text-sm pb-5 border-b border-[#DDDDDD] border-dashed">
        <div className="">
          <p className="font-redhat text-sm text-[#777777]">
            <span className="pr-2">
              <FiberManualRecordIcon
                fontSize="6px"
                className="text-[#A364F5]"
              />
            </span>
            Cabs booked
          </p>
          <p className="font-sans font-semibold text-base pt-2">80.7 %</p>
        </div>
        <div>
          <p className="font-redhat text-sm text-[#777777]">
            <span className="pr-2">
              <FiberManualRecordIcon
                fontSize="6px"
                className="text-[#18C4B8]"
              />
            </span>
            Cancelled by customer
          </p>
          <p className="font-sans font-semibold text-base pt-2">9.2 %</p>
        </div>
      </div>
      <p className="text-base text-[#777777] mt-4">
        This ratio is as per the customer engagement and clicks in the sector to
        the successful bookings made
      </p>
    </div>
  );
};

export default Saletypechart;
