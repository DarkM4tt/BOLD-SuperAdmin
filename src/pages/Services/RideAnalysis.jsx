import React from "react";

const RideAnalysis = () => {
  return <div>RideAnalysis</div>;
};

export default RideAnalysis;

// import { useState, useRef, useEffect } from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from "chart.js";
// import { Line } from "react-chartjs-2";
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import SearchIcon from "@mui/icons-material/Search";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
// import SubmittedDocumentsCard from "../../components/common/SubmittedDocuments";
// import InputSearchBar from "../../components/common/InputSearchBar";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const RideAnalysis = () => {
//   const chartRef = useRef(null);
//   const [gradient, setGradient] = useState(null);

//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = chartRef.current;
//       const ctx = chart.ctx;

//       // Calculate the chart's dimensions for gradient bounds
//       const chartArea = chart.chartArea;
//       const gradientFill = ctx.createLinearGradient(
//         0, // x0
//         chartArea.top, // y0
//         0, // x1
//         chartArea.bottom // y1
//       );

//       gradientFill.addColorStop(0, "rgba(59, 130, 246, 0.5)"); // Blue with opacity
//       gradientFill.addColorStop(0.5, "rgba(59, 130, 246, 0.25)");
//       gradientFill.addColorStop(1, "rgba(59, 130, 246, 0)");
//       setGradient(gradientFill);
//     }
//   }, []);

//   const data = {
//     labels: ["May", "Jun", "Jul", "Aug", "Sep"],
//     datasets: [
//       {
//         label: "Last 6 months",
//         data: [200000, 250000, 150000, 270000, 230000],
//         borderColor: "#3B82F6", // Blue line color
//         backgroundColor: gradient || "rgba(59, 130, 246, 0.5)", // Fallback to solid color
//         tension: 0.4, // Curved line
//         fill: true,
//         borderWidth: 0.5,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       datalabels: {
//         display: false, // This hides the data labels
//       },
//       legend: {
//         display: false, // Hide legend
//       },
//       tooltip: {
//         enabled: false, // Disable tooltips
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false, // Hide gridlines
//         },
//         ticks: {
//           display: false, // Hide x-axis numbers
//         },
//       },
//       y: {
//         grid: {
//           display: false, // Hide gridlines
//         },
//         ticks: {
//           display: false, // Hide y-axis numbers
//         },
//       },
//     },
//   };

//   const EntityTable = () => {
//     const customersData = [
//       {
//         id: 1,
//         name: "Omar Botosh",
//         image: "https://via.placeholder.com/40", // Replace with actual image URL
//         startDate: "2 Oct, 2024",
//         duration: "1 day",
//         vehicle: "MK 01MA 220L",
//         amountCharged: "€ 1200",
//       },
//       {
//         id: 2,
//         name: "Nolan Geidt",
//         image: "https://via.placeholder.com/40",
//         startDate: "2 Oct, 2024",
//         duration: "1 day",
//         vehicle: "MK 01MA 220L",
//         amountCharged: "€ 1200",
//       },
//       {
//         id: 3,
//         name: "Omar Botosh",
//         image: "https://via.placeholder.com/40", // Replace with actual image URL
//         startDate: "2 Oct, 2024",
//         duration: "1 day",
//         vehicle: "MK 01MA 220L",
//         amountCharged: "€ 1200",
//       },
//       {
//         id: 4,
//         name: "Nolan Geidt",
//         image: "https://via.placeholder.com/40",
//         startDate: "2 Oct, 2024",
//         duration: "1 day",
//         vehicle: "MK 01MA 220L",
//         amountCharged: "€ 1200",
//       },
//       // Add more data as needed
//     ];

//     return (
//       <Box
//         sx={{
//           marginTop: "24px",
//           padding: "16px",
//           backgroundColor: "#fff",
//           display: "flex",
//           flexDirection: "column",
//           gap: "30px",
//           borderRadius: "8px",
//         }}
//       >
//         <div className="flex justify-between">
//           <p className="font-redhat font-semibold text-2xl">Top customers</p>
//         </div>
//         <TableContainer>
//           <Table>
//             {/* Table Header */}
//             <TableHead
//               sx={{
//                 "& .MuiTableCell-root": {
//                   backgroundColor: "#EEEEEE",
//                   fontWeight: "400",
//                   fontSize: "16px",
//                   borderBottom: "none",
//                 },
//                 "& .MuiTableCell-root:first-of-type": {
//                   borderTopLeftRadius: "10px",
//                   borderBottomLeftRadius: "10px",
//                 },
//                 "& .MuiTableCell-root:last-of-type": {
//                   borderTopRightRadius: "10px",
//                   borderBottomRightRadius: "10px",
//                 },
//               }}
//             >
//               <TableRow>
//                 {[
//                   "Customer name",
//                   "Start date",
//                   "Duration",
//                   "Vehicle",
//                   "Amount charged",
//                   "Options",
//                 ].map((header) => (
//                   <TableCell key={header}>{header}</TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>

//             {/* Table Body */}
//             <TableBody>
//               {customersData.map((customer) => (
//                 <TableRow
//                   key={customer.id}
//                   sx={{
//                     cursor: "pointer",
//                   }}
//                 >
//                   <TableCell sx={{ fontWeight: 600, fontSize: "16px" }}>
//                     <div className="flex items-center gap-2">
//                       {/* <img
//                         src={Rentalpartner}
//                         alt={customer.name}
//                         className="w-10 h-10 rounded-full"
//                       /> */}
//                       {customer.name}
//                     </div>
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 600, fontSize: "16px" }}>
//                     {customer.startDate}
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 600, fontSize: "16px" }}>
//                     {customer.duration}
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 600, fontSize: "16px" }}>
//                     {customer.vehicle}
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 600, fontSize: "16px" }}>
//                     {customer.amountCharged}
//                   </TableCell>
//                   <TableCell>
//                     <button>
//                       <MoreHorizIcon className="text-[#777777]" />
//                     </button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     );
//   };

//   return (
//     <div className=" bg-backGround">
//       <div className="flex justify-between items-center font-redhat text-base font-semibold ">
//         <p className="font-redhat font-semibold text-base flex items-center">
//           <span className="text-[#777777] pr-1">{"Services"} </span>
//           {"> Rides"}
//         </p>
//         <InputSearchBar />
//       </div>

//       {/* Buttons */}

//       {/* Cards */}
//       <div className="flex justify-between pt-8">
//         {/* Left Cards */}
//         <div className="w-4/6">
//           {/* Top Three Cards */}
//           <div className="flex justify-between">
//             <div
//               className="w-[30%] flex flex-col p-4 bg-white rounded-lg border-b border-[#1860C4]"
//               style={{ boxShadow: "4px 4px 33px 0px #0000000A" }}
//             >
//               <div className="flex justify-between items-center  ">
//                 <p className="font-redhat font-semibold text-base">
//                   Revenue generated
//                 </p>
//                 <button>
//                   <MoreHorizIcon className="text-[#777777]" />
//                 </button>
//               </div>
//               <div className="flex gap-2 pt-2 items-center">
//                 <p className="font-redhat font-bold text-2xl">€ 22.1 M</p>
//                 <p className="font-redhat font-semibold text-xs text-[#777777]">
//                   {" "}
//                   <span>
//                     <TrendingUpIcon className="text-[#18C4B8] pr-2" />
//                   </span>
//                   2% UP
//                 </p>
//               </div>
//               <div className="mt-4 h-16 flex-grow">
//                 <Line ref={chartRef} data={data} options={options} />
//               </div>
//             </div>
//             <div
//               className="w-[30%] p-6 flex gap-6 bg-white items-center rounded-lg border-b border-[#1860C4]"
//               style={{ boxShadow: "4px 4px 33px 0px #0000000A" }}
//             >
//               <div className="p-2 rounded-lg bg-[#F6A0171F] h-fit">
//                 <DirectionsCarFilledIcon
//                   fontSize="medium"
//                   className="text-[#F6A017]"
//                 />
//               </div>
//               <div className="">
//                 <p className="font-redhat font-semibold text-base">
//                   Total service done
//                 </p>
//                 <p className="pt-2 font-redhat font-bold text-2xl">33k</p>
//                 <p className="pt-2 text-sm text-[#777777] font-redhat">
//                   12k new request
//                 </p>
//                 <p className="pt-2 text-sm text-[#777777] font-redhat">
//                   Acceptance ratio 32%
//                 </p>
//               </div>
//             </div>
//             <div
//               className="w-[30%] p-6 flex flex-col gap-6 bg-white rounded-lg border-b border-[#1860C4]"
//               style={{ boxShadow: "4px 4px 33px 0px #0000000A" }}
//             >
//               <div className="flex justify-between items-center w-full  ">
//                 <p className="font-redhat font-semibold text-base">
//                   Partner profile
//                 </p>
//                 <button>
//                   <MoreHorizIcon className="text-[#777777]" />
//                 </button>
//               </div>
//               <div className="pt-3 flex gap-4 items-center">
//                 {/* <img
//                   src={Rentalpartner}
//                   className="w-[16%]"
//                   alt="rentalpartner "
//                 /> */}
//                 <p className="font-sans text-base">ABC Company Ltd</p>
//               </div>
//               <button className="w-full bg-black py-2 font-redhat font-semibold text-lg text-white rounded-lg">
//                 {"Visit profile >>"}
//               </button>
//             </div>
//           </div>
//           {/* Table */}
//           <EntityTable />
//         </div>

//         {/* Right Cards */}
//         <div className="w-[30%] flex flex-col gap-6">
//           <div className="px-4 py-6 bg-white rounded-lg">
//             <p className="font-redhat font-semibold text-2xl">
//               Vehicle details
//             </p>
//             <div className="flex gap-4 items-center py-6">
//               {/* <img src={rentalonlinebooking} alt="" /> */}
//               <div className="">
//                 <p className="font-semibold text-xl font-sans">
//                   FORD Mustandg GT
//                 </p>
//                 <p className="font-sans text-base text-[#777777]">
//                   Plate number : JH01AMSSK01
//                 </p>
//               </div>
//             </div>
//           </div>
//           <SubmittedDocumentsCard />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RideAnalysis;
