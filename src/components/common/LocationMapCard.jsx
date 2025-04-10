import { GoogleMap, Marker } from "@react-google-maps/api";
import { IconButton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import useGoogleMapsLoader from "../../useGoogleMapsLoader";

const Locationmapcard = ({
  email = "unanimeplanet.com",
  phone = "+351 2210 02912",
  address = "Opposite DEF company office, Mall Road, Snta street, Aviero Portugal. 110091",
  center = [0, 0],
}) => {
  const { isLoaded, loadError } = useGoogleMapsLoader();

  const centerOfMap = { lat: center[0], lng: center[1] };
  const customIcon = isLoaded
    ? {
        url: BusinessIcon,
        scaledSize: new window.google.maps.Size(40, 40),
      }
    : null;

  if (loadError) {
    return <p>Error loading Google Maps: {loadError.message}</p>;
  }

  if (!isLoaded) {
    return <p>Loading Google Maps...</p>;
  }

  return (
    <div
      className="rounded-lg flex-grow flex flex-col bg-white py-6 px-4 min-h-[600px]"
      style={{ boxShadow: "4px 4px 33px 0px #0000000A" }}
    >
      <div className="flex justify-between items-center">
        <p className="font-redhat font-semibold text-base">
          {email ? "Company contact" : "Location"}
        </p>
        <IconButton aria-label="options">
          <MoreHorizIcon />
        </IconButton>
      </div>
      <div className="pt-8 flex flex-col gap-4 pb-6 border-b border-[#DDDDDD] border-dashed ">
        <div className="flex items-center gap-3">
          <div className="bg-[#6FA4EE1F] rounded-lg items-start p-3 ">
            <CallIcon />
          </div>
          <p className="font-sans text-base ">Call : {phone}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#6FA4EE1F] rounded-lg items-start p-3 ">
            <EmailIcon />
          </div>
          {email ? (
            <p className="font-sans text-base">Mail : {email}</p>
          ) : (
            <p className="font-sans text-base font-bold ">Send mail now</p>
          )}
        </div>
      </div>
      <p className="font-sans text-base pt-6">
        <span className="text-[#777777]">Address :</span> {address}
      </p>
      {centerOfMap ? (
        <div className="flex-grow pt-6">
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "" }}
            center={centerOfMap}
            zoom={12}
          >
            <Marker position={centerOfMap} icon={customIcon} />
          </GoogleMap>
        </div>
      ) : (
        <p className="text-red-400 text-lg font-bold">
          No address registered yet!
        </p>
      )}
    </div>
  );
};

export default Locationmapcard;
