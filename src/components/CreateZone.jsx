import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DrawingManager,
  GoogleMap,
  InfoWindow,
  Marker,
  Polygon,
} from "@react-google-maps/api";
import {
  useAddZoneMutation,
  useFetchCitiesQuery,
  useFetchCountriesQuery,
  useFetchZonesQuery,
} from "../services/locationApi";
import { useSnackbar } from "../context/SnackbarProvider";
import { getCountryCenter } from "../utils/dates";
import { Button, MenuItem, TextField } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoadingAnimation from "./common/LoadingAnimation";
import useGoogleMapsLoader from "../hooks/useGoogleMapsLoader";
import BackArrow from "../assets/backArrow.svg";

const DEFAULT_CENTER = { lat: 38.7169, lng: -9.1399 };
const zoneColors = {
  YELLOW_ZONE: "yellow",
  BLUE_ZONE: "blue",
  RED_ZONE: "red",
};

const CreateZone = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [zoneName, setZoneName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [mapType, setMapType] = useState("RED_ZONE");

  const drawingManagerRef = useRef(null);
  const polygonRef = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useGoogleMapsLoader();
  const [markerPosition, setMarkerPosition] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [drawingControlEnabled, setDrawingControlEnabled] = useState(true);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [polygon, setPolygon] = useState([]);
  const [cityCoords, setCityCoords] = useState([]);
  const [addZone, { isLoading: isAddingZone }] = useAddZoneMutation();

  const {
    data: countryData,
    isLoading: countriesLoading,
    error,
  } = useFetchCountriesQuery({
    page: 1,
    limit: 300,
  });
  const allCountries = countryData?.data?.countries?.results || [];
  const { data: cityData } = useFetchCitiesQuery(
    {
      page: 1,
      limit: 300,
      countryId: country?.id,
    },
    {
      skip: !country,
    }
  );
  const allCities = cityData?.data?.cities?.results || [];
  const { data: prevZoneData } = useFetchZonesQuery(
    { page: 1, cityId: city?.id },
    {
      skip: !city,
    }
  );
  const prevZones = prevZoneData?.data?.zones?.results || [];

  const getStrokeColor = useCallback(() => {
    if (mapType === "RED_ZONE") {
      return "#FF0000";
    } else if (mapType === "BLUE_ZONE") {
      return "blue";
    }
    return "yellow";
  }, [mapType]);

  const getOpacityColor = useCallback(() => {
    if (mapType === "RED_ZONE") {
      return "#FF7F7F";
    } else if (mapType === "BLUE_ZONE") {
      return "#87CEFA";
    }
    return "#FFFF99";
  }, [mapType]);

  useEffect(() => {
    if (polygonRef.current) {
      polygonRef.current.setOptions({
        strokeColor: getStrokeColor(),
        fillColor: getOpacityColor(),
      });
    }
  }, [getOpacityColor, getStrokeColor, mapType]);

  const onCityChange = (event) => {
    const cityData = event.target.value;
    setCity(cityData);
    const newCenter = {
      lat: parseFloat(cityData?.center_location?.coordinates[1]),
      lng: parseFloat(cityData?.center_location?.coordinates[0]),
    };
    const cityCoords = cityData?.location?.coordinates[0].map(([lng, lat]) => ({
      lat,
      lng,
    }));
    setCityCoords(cityCoords);
    setMapCenter(newCenter);
    if (mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      cityCoords.forEach((coord) => bounds.extend(coord));
      mapRef.current.fitBounds(bounds);
    }
  };

  const onCountryChange = (event) => {
    const country = event.target.value;
    setCountry(country);

    const latLng = getCountryCenter(country.iso_code);

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
    setCityCoords([]);
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

      polygonRef.current = e.overlay;

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
      setDrawingControlEnabled(false);

      const centroid = calculatePolygonCentroid(coordinates);
      setMapCenter(centroid);
      setMarkerPosition(centroid);
    }
  }, []);

  const handleReset = () => {
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

  const handleAddZone = async () => {
    if (!country || !city || !polygon || !mapType) return;

    const zoneData = {
      name: zoneName,
      zone_type: mapType,
      city_id: city?.id,
      country_id: country?.id,
      color: getStrokeColor(),
      location: {
        coordinates: [polygon],
      },
      center_location: {
        coordinates: [mapCenter?.lng, mapCenter?.lat],
      },
    };

    try {
      const result = await addZone(zoneData).unwrap();
      showSnackbar(result?.message || "Zone added successfully!", "success");
      if (result?.success) {
        const { country_id, city_id, id } = result?.data?.zone || {};
        const data = {
          countryId: country_id,
          cityId: city_id,
          zoneId: id,
          rideTypePrice: "ZONE_BASE",
        };
        navigate(`${id}/prices`, {
          state: { data },
        });
      }
    } catch (error) {
      showSnackbar(error?.data?.message || "Failed to add zone!", "error");
    }
  };

  if (loadError || error) {
    return (
      <p className="text-lg text-red-400 font-bold">
        {error?.data?.message || "Error"}
      </p>
    );
  }

  if (!isLoaded || countriesLoading) {
    return <LoadingAnimation height={500} width={500} />;
  }

  return (
    <>
      <p className="font-redhat text-base font-semibold">
        {"> Dashboard > Zones > New zone"}
      </p>

      <p className="font-redhat font-semibold text-2xl mt-8">
        <img
          src={BackArrow}
          alt="BackArrow"
          className="cursor-pointer inline mr-4"
          onClick={() => navigate(-1)}
        />
        Overview
      </p>

      <p className="font-redhat font-bold text-3xl mt-8">Create new zone</p>
      <p className="font-sans font-semibold text-2xl mt-4">
        Enter the map details
      </p>

      {/* Dropdowns */}
      <div className="flex justify-between mt-8">
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
            onChange={onCountryChange}
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
              Select country
            </MenuItem>
            {allCountries.map((country) => (
              <MenuItem key={country?.id} value={country}>
                {country?.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="flex flex-col w-60">
          <label
            htmlFor="fuel-type"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Select city
          </label>
          <TextField
            id="fuel-type"
            select
            placeholder="Select fuel type"
            variant="outlined"
            size="small"
            value={city}
            onChange={onCityChange}
            fullWidth
            SelectProps={{
              displayEmpty: true,
              IconComponent: ExpandMoreIcon,
            }}
          >
            <MenuItem value="" disabled>
              {!country ? (
                <p className="text-red-400">No country selected!</p>
              ) : allCities.length === 0 ? (
                <p className="text-red-400">No cities yet!</p>
              ) : (
                "Select city"
              )}
            </MenuItem>
            {allCities.map((city) => (
              <MenuItem key={city?.id} value={city}>
                {city?.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="flex flex-col w-60">
          <label
            htmlFor="fuel-type"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Select zone type
          </label>
          <TextField
            id="fuel-type"
            select
            placeholder="Select map type"
            variant="outlined"
            size="small"
            value={mapType}
            onChange={(e) => setMapType(e.target.value)}
            fullWidth
            SelectProps={{
              displayEmpty: true,
              IconComponent: ExpandMoreIcon,
            }}
          >
            <MenuItem value="" disabled>
              Select zone type
            </MenuItem>
            <MenuItem value="RED_ZONE">Red zone (Maximum demand area)</MenuItem>
            <MenuItem value="YELLOW_ZONE">
              Yellow zone (Medium demand area)
            </MenuItem>
            <MenuItem value="BLUE_ZONE">
              Blue zone (Minimum demand area)
            </MenuItem>
          </TextField>
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="fuel-card-name"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Enter zone name
          </label>
          <TextField
            id="fuel-card-name"
            placeholder="Enter zone name"
            variant="outlined"
            size="small"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            fullWidth
          />
        </div>
      </div>

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
              strokeColor: `${getStrokeColor()}`,
              fillColor: `${getOpacityColor()}`,
              strokeWeight: 4,
              fillOpacity: 0.8,
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
              fillColor: `${getStrokeColor()}`,
              strokeColor: `${getOpacityColor()}`,
              fillOpacity: 0.6,
              strokeWeight: 2,
              strokeOpacity: 1,
              editable: true,
              draggable: true,
            }}
          />
        )}

        {city && (
          <Polygon
            paths={cityCoords}
            options={{
              strokeColor: "green",
              fillColor: "#90EE90",
              fillOpacity: 0.2,
              strokeWeight: 6,
              strokeOpacity: 1,
            }}
          />
        )}

        {prevZones?.length > 0 &&
          prevZones?.map((zone) => {
            const { coordinates } = zone.location;
            const polygonPath = coordinates[0].map(([lng, lat]) => ({
              lat,
              lng,
            }));

            return (
              <React.Fragment key={zone?.id}>
                <Polygon
                  paths={polygonPath}
                  options={{
                    fillColor: zoneColors[zone?.zone_type] || "gray",
                    fillOpacity: 0.4,
                    strokeColor: zoneColors[zone?.zone_type] || "gray",
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    draggable: false,
                    editable: false,
                  }}
                />
                <Marker
                  position={{
                    lat: zone?.center_location?.coordinates[1],
                    lng: zone?.center_location?.coordinates[0],
                  }}
                  label={{
                    text: zone?.name,
                    color: "black",
                    fontWeight: "bold",
                  }}
                />
              </React.Fragment>
            );
          })}

        {markerPosition && (
          <Marker
            position={markerPosition}
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

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <Button
          variant="outlined"
          sx={{
            textTransform: "none",
            borderColor: "black",
            color: "black",
            borderRadius: "5px",
            backgroundColor: "#fff",
            paddingInline: "6%",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              borderColor: "black",
            },
          }}
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          sx={{
            paddingInline: "6%",
            paddingBlock: "8px",
            textTransform: "none",
            backgroundColor: "black",
            borderRadius: "5px",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
          disabled={
            !city ||
            !country ||
            polygon?.length < 3 ||
            zoneName?.trim()?.length < 4
          }
          onClick={handleAddZone}
        >
          {isAddingZone ? (
            <LoadingAnimation height={30} width={30} />
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </>
  );
};

export default CreateZone;
