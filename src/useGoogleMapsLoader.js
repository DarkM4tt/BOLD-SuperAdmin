import { useJsApiLoader } from "@react-google-maps/api";

const googleMapsApiOptions = {
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_CONSOLE_KEY,
  libraries: ["drawing", "places", "geometry"],
};

const useGoogleMapsLoader = () => {
  return useJsApiLoader(googleMapsApiOptions);
};

export default useGoogleMapsLoader;
