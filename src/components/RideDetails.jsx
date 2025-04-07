import { useNavigate, useParams } from "react-router-dom";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { Avatar } from "@mui/material";
import { useSnackbar } from "../context/SnackbarProvider";
import { formatCreatedAt, formatToTime } from "../utils/dates";
import { useFetchRideDetailsQuery } from "../features/rideApi";
import useGoogleMapsLoader from "../useGoogleMapsLoader";
import LoadingAnimation from "./common/LoadingAnimation";
import InputSearchBar from "./common/InputSearchBar";
import GenerateReportButton from "./common/GenerateReportButton";
import BackArrow from "../assets/backArrow.svg";
import MapVehicle from "../assets/mapVehicle.svg";
import PickupIcon from "../assets/pickup.svg";
import DropoffIcon from "../assets/dropoff.svg";

const RideInfo = () => {
  const params = useParams();
  const { rideId } = params;
  const navigate = useNavigate();
  const { isLoaded, loadError } = useGoogleMapsLoader();
  const { data, error, isLoading } = useFetchRideDetailsQuery(rideId);
  const rideData = data?.data;
  const showSnackbar = useSnackbar();

  if (error || loadError) {
    showSnackbar(error?.data?.message || "Error in loading data....");
    return (
      <p className="text-red-400 text-lg font-redhat font-semibold">
        {error?.data?.message || "Error loading data "}{" "}
      </p>
    );
  }

  if (!isLoaded || isLoading) {
    return <LoadingAnimation height={500} width={500} />;
  }

  const { ride_request, driver_polyline, status } = rideData || {};
  const pickup = ride_request?.pickup_location?.coordinates || [];
  const dropoff = ride_request?.dropoff_location?.coordinates || [];
  const driverPolylinePath = driver_polyline;
  const initialPolylinePath = ride_request?.initial_polyline;

  const decodePolyline = (encoded) => {
    const google = window?.google;
    return google?.maps?.geometry?.encoding
      ?.decodePath(encoded)
      ?.map((latLng) => ({
        lat: latLng?.lat(),
        lng: latLng?.lng(),
      }));
  };

  const driverPath = driverPolylinePath
    ? decodePolyline(driverPolylinePath)
    : [];
  const initialPath = initialPolylinePath
    ? decodePolyline(initialPolylinePath)
    : [];

  let vehiclePosition = null;
  if (status === "COMPLETED")
    vehiclePosition = { lat: dropoff[1], lng: dropoff[0] };
  else vehiclePosition = { lat: pickup[1], lng: pickup[0] };

  const getLabel = () => {
    const rideStatus = rideData?.status;
    if (rideStatus === "CANCELED") return "Ride canceled on";
    if (rideStatus === "REJECTED") return "Ride rejected on";
    if (rideStatus === "COMPLETED") return "Ride completed on";
    if (rideStatus === "ARRIVED") return "Ride arrived on";
    if (rideStatus === "ACCEPTED") return "Ride accepted on";
    if (rideStatus === "ONROUTE") return "Ride onroute on";
    return "Ride completed on";
  };

  const getDateTime = () => {
    const rideStatus = rideData?.status;
    if (rideStatus === "CANCELED") return rideData?.cancelled_at;
    if (rideStatus === "REJECTED") return rideData?.rejected_at;
    if (rideStatus === "COMPLETED") return rideData?.completed_at;
    if (rideStatus === "ARRIVED") return rideData?.arrived_at;
    if (rideStatus === "ACCEPTED") return rideData?.accepted_at;
    if (rideStatus === "ONROUTE") return rideData?.onroute_at;
    return null;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center font-redhat text-base font-semibold ">
        <p className="font-redhat font-semibold text-base flex items-center">
          <span className="text-[#777777] pr-2">{"Dashboard > Rides"}</span>
          {"> Ride details"}
        </p>
        <InputSearchBar />
      </div>

      <div className="flex justify-between items-center mt-8">
        <div className="flex items-center gap-4 font-redhat font-semibold text-2xl">
          <img
            src={BackArrow}
            alt="BackArrow"
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <p>Overview</p>
        </div>
        <GenerateReportButton />
      </div>

      {/* <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 pt-6">
          <div className="py-3 px-4 text-sm font-redhat bg-white rounded-[40px]">
            Visit 3rd Party partner profile{" "}
            <span className="pl-2">
              {" "}
              <KeyboardDoubleArrowRightIcon />
            </span>{" "}
          </div>
          <div className="py-3 px-4 text-sm font-redhat bg-white rounded-[40px]">
            Visit customer profile{" "}
            <span className="pl-2">
              {" "}
              <KeyboardDoubleArrowRightIcon />
            </span>{" "}
          </div>
          <div className="py-3 px-4 text-sm font-redhat bg-white rounded-[40px]">
            View vehicle details{" "}
            <span className="pl-2">
              {" "}
              <KeyboardDoubleArrowRightIcon />
            </span>{" "}
          </div>
        </div>
      </div> */}

      <div className="bg-white rounded-lg p-6 w-full mx-auto mt-4 font-redhat text-base">
        {/* Top Row Labels */}
        <div className="grid grid-cols-6 gap-4 font-normal mb-2">
          <div>Customer name</div>
          <div>Driver name</div>
          <div>Distance (km)</div>
          <div>From</div>
          <div>To</div>
          <div>Ride booked on</div>
        </div>

        {/* Top Row Data */}
        <div className="grid grid-cols-6 gap-4 font-semibold">
          <div className="col-span-1 flex items-center space-x-2">
            {rideData?.customer_info?.profile_pic ? (
              <img
                src={rideData?.customer_info?.profile_pic}
                alt={rideData?.customer_info?.full_name || "No name"}
              />
            ) : (
              <Avatar
                src="/avatar.jpg"
                alt={rideData?.customer_info?.full_name || "No name"}
              />
            )}
            <span>{rideData?.customer_info?.full_name || "No name"}</span>
          </div>
          <div className="col-span-1 flex items-center space-x-2">
            {rideData?.driver_info?.profile_pic ? (
              <img
                src={rideData?.driver_info?.profile_pic}
                alt={rideData?.driver_info?.full_name || "No name"}
              />
            ) : (
              <Avatar
                src="/avatar.jpg"
                alt={rideData?.driver_info?.full_name || "No name"}
              />
            )}
            <span>{rideData?.driver_info?.full_name || "No name"}</span>
          </div>
          <div className="col-span-1">
            {rideData?.ride_request?.distance_in_meters
              ? rideData?.ride_request?.distance_in_meters / 1000
              : "Not known!"}
          </div>
          <div className="col-span-1">
            {rideData?.ride_request?.pickup_address || "Not known!"}
          </div>
          <div className="col-span-1">
            {rideData?.ride_request?.dropoff_address || "Not known!"}
          </div>
          <div className="col-span-1">
            {rideData?.createdAt
              ? `${formatCreatedAt(rideData?.createdAt)} | ${formatToTime(
                  rideData?.createdAt
                )}`
              : "Not known!"}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-[1px] border-[#DDDDDD] my-4"></div>

        {/* Bottom Row Labels */}
        <div className="grid grid-cols-6 gap-4 font-normal mb-2">
          <div>Ride type</div>
          <div>Vehicle</div>
          <div>Amount spend</div>
          <div>Customer rating</div>
          <div>Ride status</div>
          <div>{getLabel()}</div>
        </div>

        {/* Bottom Row Data */}
        <div className="grid grid-cols-6 gap-4 font-semibold">
          <div className="col-span-1">
            {rideData?.ride_service || "Not known!"}
          </div>
          <div className="col-span-1">
            {rideData?.vehicle_info?.vin || "Not known!"}
          </div>
          <div className="col-span-1">€ {rideData?.captured_amount}</div>
          <div className="col-span-1">
            {rideData?.customer_rating?.rating / 5 || "Not rated!"}
          </div>
          <div className="col-span-1">{rideData?.status || "Not known!"}</div>
          <div className="col-span-1">
            {getDateTime() !== null
              ? `${formatCreatedAt(getDateTime())} | ${formatToTime(
                  getDateTime()
                )}`
              : "Not known!"}
          </div>
        </div>
      </div>

      <div className="rounded-lg  flex flex-col bg-white py-6 px-4 gap-10">
        <p className="font-redhat font-semibold text-2xl">
          Journey map highlight
        </p>
        <div className=" overflow-hidden rounded-2xl">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "500px" }}
            center={{ lat: pickup[1], lng: pickup[0] }}
            zoom={13}
          >
            <Marker
              position={{ lat: pickup[1], lng: pickup[0] }}
              icon={{
                url: PickupIcon,
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />

            <Marker
              position={{ lat: dropoff[1], lng: dropoff[0] }}
              icon={{
                url: DropoffIcon,
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />

            {vehiclePosition && (
              <Marker
                position={vehiclePosition}
                icon={{
                  url: MapVehicle,
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
            )}

            {initialPath?.length > 0 && (
              <Polyline
                path={initialPath}
                options={{
                  strokeColor: "#000000",
                  strokeOpacity: 0.8,
                  strokeWeight: 8,
                }}
              />
            )}

            {driverPath?.length > 0 && (
              <Polyline
                path={driverPath}
                options={{
                  strokeColor: "#0000FF",
                  strokeOpacity: 0.8,
                  strokeWeight: 8,
                }}
              />
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};

export default RideInfo;
