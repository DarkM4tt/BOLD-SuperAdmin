import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DrawingManager,
  GoogleMap,
  InfoWindow,
  Marker,
  Polygon,
} from "@react-google-maps/api";
import { City } from "country-state-city";
import { getCountryCenter } from "../utils/dates";
import {
  useAddCityMutation,
  useFetchCountriesQuery,
} from "../services/locationApi";
import { useSnackbar } from "../context/SnackbarProvider";
import { Button, MenuItem, Stack, TextField } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useGoogleMapsLoader from "../hooks/useGoogleMapsLoader";
import LoadingAnimation from "./common/LoadingAnimation";
import BackArrow from "../assets/backArrow.svg";

const DEFAULT_CENTER = { lat: 38.7169, lng: -9.1399 };

const AddCity = () => {
  const navigate = useNavigate();
  const [drawingControlEnabled, setDrawingControlEnabled] = useState(true);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [polygon, setPolygon] = useState([]);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [allCities, setAllCities] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const showSnackbar = useSnackbar();

  const { data: countryData, isLoading: loading } = useFetchCountriesQuery({
    page: 1,
    limit: 300,
  });
  const [addCity, { isLoading: isAddingCity }] = useAddCityMutation();
  const allCountries = countryData?.data?.countries?.results || [];

  const drawingManagerRef = useRef(null);
  const polygonRef = useRef(null);
  const mapRef = useRef(null);
  const { isLoaded, loadError } = useGoogleMapsLoader();

  const fetchCities = useCallback(() => {
    if (!country) return;
    setCityLoading(true);
    try {
      const cities = City.getCitiesOfCountry(country);
      setAllCities(cities || []);
    } catch (error) {
      console.log(error);
    } finally {
      setCityLoading(false);
    }
  }, [country]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);

    const latLng = getCountryCenter(selectedCountry);
    if (latLng) {
      const newCenter = {
        lat: parseFloat(latLng[0]),
        lng: parseFloat(latLng[1]),
      };
      setMapCenter(newCenter);
      mapRef.current.panTo(newCenter);
      mapRef.current.setZoom(5);
    }
    setCity("");
  };

  const handleCityChange = (e) => {
    const selectedCity = allCities.find((c) => c.name === e.target.value);
    setCity(selectedCity?.name || "");

    if (selectedCity?.latitude && selectedCity?.longitude) {
      const newCenter = {
        lat: parseFloat(selectedCity.latitude),
        lng: parseFloat(selectedCity.longitude),
      };
      setMapCenter(newCenter);
      mapRef.current.panTo(newCenter);
      mapRef.current.setZoom(12);
    }
  };

  const calculatePolygonCentroid = (coords) => {
    let area = 0;
    let centroidX = 0;
    let centroidY = 0;

    for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
      const lat1 = coords[i][1];
      const lng1 = coords[i][0];
      const lat2 = coords[j][1];
      const lng2 = coords[j][0];

      const factor = lat1 * lng2 - lat2 * lng1;
      area += factor;
      centroidX += (lat1 + lat2) * factor;
      centroidY += (lng1 + lng2) * factor;
    }

    area /= 2;
    centroidX = centroidX / (6 * area);
    centroidY = centroidY / (6 * area);

    return { lat: centroidX, lng: centroidY };
  };

  const onOverlayComplete = useCallback((e) => {
    if (e.type === "polygon") {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }

      const path = e.overlay.getPath();
      const coordinates = [];

      for (let i = 0; i < path.getLength(); i++) {
        const point = path.getAt(i);
        coordinates.push([point.lng(), point.lat()]);
      }

      if (
        coordinates.length > 0 &&
        coordinates[0] !== coordinates[coordinates.length - 1]
      ) {
        coordinates.push(coordinates[0]);
      }

      setPolygon(coordinates);
      polygonRef.current = e.overlay;
      setDrawingControlEnabled(false);

      const centroid = calculatePolygonCentroid(coordinates);
      setMapCenter(centroid);
      setMarkerPosition(centroid);
    }
  }, []);

  const handleReset = () => {
    setCountry("");
    setCity("");
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }
    setPolygon([]);
    setDrawingControlEnabled(true);
    setMapCenter(DEFAULT_CENTER);
    setMarkerPosition(null);
    drawingManagerRef.current.setDrawingMode(
      window.google.maps.drawing.OverlayType.POLYGON
    );
  };

  const handleAddCity = async () => {
    const selectedCountry = allCountries?.filter(
      (contry) => contry?.iso_code === country
    );

    const cityData = {
      country_code: country,
      name: city,
      country_id: selectedCountry[0]?.id,
      location: {
        type: "Polygon",
        coordinates: [polygon],
      },
      center_location: {
        type: "Point",
        coordinates: [mapCenter?.lng, mapCenter?.lat],
      },
      airport_business: true,
      city_business: true,
      zone_business: true,
      is_business: true,
      is_active: true,
      is_deleted: false,
    };

    try {
      const result = await addCity(cityData).unwrap();
      showSnackbar(result?.message || "City added successfully!", "success");
      if (result?.success) {
        const { country_id, id } = result?.data?.city || {};
        const data = {
          countryId: country_id,
          cityId: id,
          zoneId: "",
          rideTypePrice: "CITY_BASE",
        };
        navigate(`${id}/prices`, {
          state: { data },
        });
      }
    } catch (error) {
      showSnackbar(error?.data?.message || "Failed to add city!", "error");
    }
  };

  if (loadError) {
    return (
      <p className="text-red-400 text-lg font-bold font-redhat">
        Error loading maps
      </p>
    );
  }

  if (loading || !isLoaded) {
    return <LoadingAnimation width={500} height={500} />;
  }

  return (
    <>
      <p className="text-gray">
        {"Location > "}
        <span className="text-black">Add Location</span>
        {" > "}
        <span className="text-black">Add City</span>
      </p>

      <div className="flex items-center gap-4 mt-8">
        <img
          src={BackArrow}
          alt="BackArrow"
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <p className="font-redhat font-semibold text-2xl">Add location</p>
      </div>

      {/* Dropdowns */}
      <div className="flex gap-20 mt-8">
        <div className="flex flex-col w-60">
          <label
            htmlFor="fuel-type"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Select country
          </label>
          <TextField
            id="fuel-type"
            select
            placeholder="Select fuel type"
            variant="outlined"
            size="small"
            value={country}
            onChange={handleCountryChange}
            fullWidth
            SelectProps={{
              displayEmpty: true,
              IconComponent: ExpandMoreIcon,
              MenuProps: {
                PaperProps: {
                  sx: {
                    maxHeight: 200, // Set dropdown height
                    overflowY: "auto", // Enable vertical scroll
                  },
                },
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
              },
            }}
          >
            <MenuItem value="" disabled>
              Select country
            </MenuItem>
            {allCountries.map((country) => (
              <MenuItem key={country?.id} value={country?.iso_code}>
                {country?.name}
              </MenuItem>
            ))}
          </TextField>
        </div>

        {cityLoading ? (
          <LoadingAnimation width={100} height={100} />
        ) : (
          <div className="flex flex-col w-60">
            <label
              htmlFor="fuel-type"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Select city to add
            </label>
            <TextField
              id="fuel-type"
              select
              placeholder="Select fuel type"
              variant="outlined"
              size="small"
              value={city}
              onChange={handleCityChange}
              fullWidth
              SelectProps={{
                displayEmpty: true,
                IconComponent: ExpandMoreIcon,
                MenuProps: {
                  PaperProps: {
                    sx: {
                      maxHeight: 200,
                      overflowY: "auto",
                    },
                  },
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                },
              }}
            >
              <MenuItem value="" disabled>
                {!country ? (
                  <p className="text-red-400">No country selected!</p>
                ) : (
                  "Select city"
                )}
              </MenuItem>
              {allCities?.length > 0 &&
                allCities.map((city) => (
                  <MenuItem key={city.id} value={city.name}>
                    {city.name}
                  </MenuItem>
                ))}
            </TextField>
          </div>
        )}
      </div>

      <p className="font-sans mt-8 font-semibold text-base">
        Mark the city boundary from the map. Make sure the city boundary covers
        all area that you want to cover in that city and provide service. You
        can search area or location from the search option in the map and make
        the boundary by simply clicking on the boundary points.
      </p>

      <GoogleMap
        mapContainerStyle={{
          height: "400px",
          width: "",
          marginTop: "32px",
          borderRadius: "16px",
        }}
        center={mapCenter}
        zoom={polygon.length > 0 ? 10 : 3}
        onLoad={(map) => (mapRef.current = map)}
      >
        <DrawingManager
          onLoad={(manager) => (drawingManagerRef.current = manager)}
          onOverlayComplete={onOverlayComplete}
          options={{
            drawingControl: drawingControlEnabled,
            drawingControlOptions: {
              position: window.google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
            },
            polygonOptions: {
              strokeColor: "green",
              fillColor: "#90EE90",
              strokeWeight: 4,
              fillOpacity: 0.4,
              strokeOpacity: 1,
              editable: true,
              draggable: true,
            },
          }}
        />

        {polygon.length > 0 && (
          <Polygon
            paths={polygon}
            options={{
              strokeColor: "green",
              strokeWeight: 4,
              fillColor: "#90EE90",
              fillOpacity: 0.4,
              strokeOpacity: 1,
              editable: true,
              draggable: true,
            }}
          />
        )}

        {markerPosition && (
          <Marker
            position={markerPosition}
            onClick={() => setShowInfoWindow(true)}
          />
        )}

        {city && (
          <Marker
            position={mapCenter}
            onClick={() => setShowInfoWindow(true)}
          />
        )}

        {showInfoWindow && markerPosition && (
          <InfoWindow
            position={markerPosition}
            onCloseClick={() => setShowInfoWindow(false)}
          >
            <div>Center of Polygon</div>
          </InfoWindow>
        )}
      </GoogleMap>

      <Stack direction="row" spacing={2} marginTop="32px">
        <Button
          variant="outlined"
          sx={{
            borderColor: "black",
            color: "black",
            textTransform: "none",
            padding: "5px 60px",
            borderRadius: "8px",
            fontSize: "14px",
            "&:hover": {
              borderColor: "black",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
          onClick={handleReset}
        >
          Reset boundary area
        </Button>

        {/* Save and confirm button */}
        <Button
          variant="contained"
          disabled={!city || !country || polygon?.length < 3}
          sx={{
            backgroundColor: "black",
            color: "white",
            textTransform: "none",
            padding: "10px 60px",
            borderRadius: "8px",
            fontSize: "14px",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
          onClick={handleAddCity}
        >
          {isAddingCity ? (
            <LoadingAnimation height={30} width={30} />
          ) : (
            "Save and confirm"
          )}
        </Button>
      </Stack>
    </>
  );
};

export default AddCity;
