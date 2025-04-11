import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchUserDetailsQuery } from "../features/userApi";
import { useFetchRidesQuery } from "../features/rideApi";
import { formatCreatedAt } from "../utils/dates";
import { TableCell } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import Avatar from "@mui/material/Avatar";
import StarIcon from "@mui/icons-material/Star";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CircularProgress from "./common/CircularProgress";
import GenerateReportButton from "./common/GenerateReportButton";
import InputSearchBar from "./common/InputSearchBar";
import LoadingAnimation from "./common/LoadingAnimation";
import ProfileModal from "./common/ProfileModal";
import BackArrow from "../assets/backArrow.svg";
import Incoming from "../assets/incoming.svg";
import Outgoing from "../assets/outgoing.svg";
import Unanswered from "../assets/unanswered.svg";
import EntityPaginatedTable from "./common/EntityPaginatedTable";

const headers = [
  "Driver",
  "Vehicle",
  "Ride type",
  "Booked on",
  "Status",
  "Total spends",
];

const renderRideRow = (ride) => {
  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;
  return (
    <>
      <TableCell>{ride?.driver_info?.full_name || "Not assigned!"}</TableCell>
      <TableCell>{ride?.vehicle_info?.vin || "Not assigned!"}</TableCell>
      <TableCell>
        {ride?.ride_service ? (
          capitalize(ride.ride_service)
        ) : (
          <p className="text-red-500">Not known!</p>
        )}
      </TableCell>
      <TableCell>
        {ride?.createdAt ? formatCreatedAt(ride?.createdAt) : "Not known!"}
      </TableCell>
      <TableCell>
        {ride?.status ? (
          capitalize(ride.status)
        ) : (
          <p className="text-red-500">Not known!</p>
        )}
      </TableCell>
      <TableCell>€ {ride?.captured_amount}</TableCell>
    </>
  );
};

const UserDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const { userId } = params;
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useFetchUserDetailsQuery(userId);
  const customerData = data?.data;
  const { data: ridesData } = useFetchRidesQuery({ userId, page });
  const {
    results = [],
    totalPages,
    isNextPage,
    isPreviousPage,
  } = ridesData?.data?.rides || {};

  if (isLoading) return <LoadingAnimation width={500} height={500} />;

  if (error) {
    return (
      <p className="text-lg font-bold font-redhat text-red-400">
        {error?.data?.message || "Error in fetching details!"}
      </p>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center font-redhat text-base font-semibold ">
        <p className="font-redhat font-semibold text-base flex items-center">
          <span className="text-[#777777] pr-1">{"Dashboard > All users"}</span>
          {`> ${customerData?.full_name}`}
        </p>
        <InputSearchBar />
      </div>

      <div className="flex items-center justify-between mt-8">
        <img
          src={BackArrow}
          alt="BackArrow"
          className="mb-4 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <GenerateReportButton />
      </div>

      <div className="flex justify-between rounded-lg pb-11 mt-6 bg-white p-6 ">
        <div className="flex gap-4">
          {customerData?.profile_pic ? (
            <img
              src={customerData?.profile_pic}
              alt="any"
              className="w-20 h-20 rounded-full cursor-pointer"
              onClick={() => setOpenProfileModal(true)}
            />
          ) : (
            <Avatar sx={{ width: "5rem", height: "5rem", borderRadius: "50%" }}>
              {customerData?.full_name?.charAt(0)}
            </Avatar>
          )}
          <div className="flex items-center gap-16">
            <div className="">
              <p className="font-sans text-2xl font-semibold flex items-center">
                {customerData?.full_name}{" "}
              </p>
              <div className="pt-2 flex gap-4">
                <p className="font-sans text-base text-[#777777] flex gap-2 items-center">
                  <span>
                    <EmailIcon fontSize="small" />
                  </span>
                  {customerData?.email}
                </p>
                <p className="font-sans text-base text-[#777777] flex gap-2 items-center underline">
                  <span>
                    <CallIcon fontSize="small" />
                  </span>
                  {customerData?.phone}
                </p>
              </div>
              <p className="font-sans pt-2 text-base text-[#777777] flex gap-2 items-center">
                User ID: {customerData?.username}
              </p>
            </div>
          </div>
        </div>
        <div className="">
          <p className="font-redhat text-xl text-[#777777]">Customer rating</p>
          <p className="pt-2 font-redhat font-bold text-xl text-[#18C4B8] text-right">
            <span className="text-[#FBDB0B] pr-2">
              <StarIcon />
            </span>
            {customerData?.rating ? customerData?.rating + "/5" : "0/5"}
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="flex gap-8 mt-8">
        <div
          className="w-[30%] p-6 flex gap-6 bg-white items-center rounded-lg border-b border-[#1860C4]"
          style={{ boxShadow: "4px 4px 33px 0px #0000000A" }}
        >
          <div className="p-2 rounded-lg bg-[#006AFF21] h-fit">
            <img src={Incoming} alt="Incoming" />
          </div>
          <div className="">
            <p className="font-redhat font-semibold text-base">Total spends</p>
            <p className="pt-2 font-redhat font-bold text-2xl">
              {customerData?.total_spends || 0}
            </p>
            <p className="pt-2 text-sm text-[#777777]">
              Last updated 2 min ago
            </p>
            <p className="pt-2 text-sm text-[#777777]">vs 290 prev 7 days</p>
          </div>
        </div>
        <div
          className="w-[30%] p-6 flex gap-6 bg-white items-center rounded-lg border-b border-[#1860C4]"
          style={{ boxShadow: "4px 4px 33px 0px #0000000A" }}
        >
          <div className="p-2 rounded-lg bg-[#00FFC321] h-fit">
            <img src={Outgoing} alt="Outgoing" />
          </div>
          <div className="">
            <p className="font-redhat font-semibold text-base">
              Total cabs booked
            </p>
            <p className="pt-2 font-redhat font-bold text-2xl">
              {customerData?.total_rides_booked || 0}
            </p>
            <p className="pt-2 text-sm text-[#777777]">
              Last updated 5 min ago
            </p>
            <p className="pt-2 text-sm text-[#777777]">vs 210 prev 5 days</p>
          </div>
        </div>
        <div
          className="w-[30%] p-6 flex gap-6 bg-white items-center rounded-lg border-b border-[#1860C4]"
          style={{ boxShadow: "4px 4px 33px 0px #0000000A" }}
        >
          <div className="p-2 rounded-lg bg-[#FFFF0021] h-fit">
            <img src={Unanswered} alt="Unanswered" />
          </div>
          <div className="">
            <p className="font-redhat font-semibold text-base">Issue raised</p>
            <p className="pt-2 font-redhat font-bold text-2xl">
              {customerData?.issue_raised || 0}
            </p>
            <p className="pt-2 text-sm text-[#777777]">for all queries</p>
          </div>
        </div>
        <div
          className="w-[30%] flex items-center gap-4 p-4 bg-white rounded-lg border-b border-[#1860C4]"
          style={{ boxShadow: "4px 4px 33px 0px #0000000A" }}
        >
          <div className="flex flex-col">
            <p className="font-redhat text-md font-semibold">Performance</p>
            <p className="font-redhat text-xs font-normal">
              0 negative rating received by customers
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <p className="font-redhat text-xs">
                <span className="pr-2">
                  <FiberManualRecordIcon
                    fontSize="6px"
                    className="text-[#EEEEEE]"
                  />
                </span>
                Booked rides
              </p>
              <p className="font-redhat text-xs">
                <span className="pr-2">
                  <FiberManualRecordIcon
                    fontSize="6px"
                    className="text-[#15D356]"
                  />
                </span>
                Completed rides
              </p>
            </div>
          </div>
          <CircularProgress
            value={customerData?.booked_rate || 80}
            primaryColor="#15D356"
            secondaryColor="#EEEEEE"
          />
        </div>
      </div>

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
      />

      <ProfileModal
        openProfileModal={openProfileModal}
        setOpenProfileModal={setOpenProfileModal}
        imageUrl={customerData?.profile_pic}
      />
    </div>
  );
};

export default UserDetails;
