import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchRideTypesQuery } from "../features/rideApi";
import {
  useAddPricesMutation,
  useDeleteRideTypePriceMutation,
  useFetchCityDetailsQuery,
  useFetchRideTypePricesQuery,
  useFetchZoneDetailsQuery,
  useUpdateRideTypePriceMutation,
} from "../features/locationApi";
import { useSnackbar } from "../context/SnackbarProvider";
import { Button, IconButton, MenuItem, TextField } from "@mui/material";
import { Delete, Save } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LoadingAnimation from "./common/LoadingAnimation";
import BackArrow from "../assets/backArrow.svg";

const UpdateRideTypePrices = () => {
  const { cityId, zoneId } = useParams();
  const navigate = useNavigate();
  const [rideTypePrices, setRideTypePrices] = useState([]);
  const [areaDetails, setAreaDetails] = useState({});
  const [newRows, setNewRows] = useState([]);
  const showSnackbar = useSnackbar();

  const [addPrices, { isLoading: isAddingPrices }] = useAddPricesMutation();
  const [deletePrice, { isLoading: isDeletingPrice }] =
    useDeleteRideTypePriceMutation();
  const [updatePrice, { isLoading: isUpdatingPrice }] =
    useUpdateRideTypePriceMutation();

  const { data: cityDetails } = useFetchCityDetailsQuery(cityId, {
    skip: !cityId,
  });
  const { data: zoneDetails } = useFetchZoneDetailsQuery(zoneId, {
    skip: !zoneId,
  });
  const {
    data: rideTypesData,
    isLoading: rideTypesLoading,
    error: rideTypesError,
  } = useFetchRideTypesQuery();
  const {
    data: rideTypePricesData,
    isLoading: rideTypePricesLoading,
    error: rideTypePricesError,
  } = useFetchRideTypePricesQuery(zoneId ? { zoneId } : { cityId }, {
    skip: !zoneId && !cityId,
  });
  const rideTypes = rideTypesData?.data?.rideTypes?.results;

  useEffect(() => {
    const data = rideTypePricesData?.data?.zoneRideTypes?.results;
    setRideTypePrices(data || []);
  }, [rideTypePricesData?.data?.zoneRideTypes?.results]);

  useEffect(() => {
    if (!cityDetails && !zoneDetails) return;
    const details = zoneId ? zoneDetails?.data?.zone : cityDetails?.data?.city;
    setAreaDetails(details);
  }, [cityDetails, zoneDetails, zoneId]);

  const handleInputChange = (index, field, value, isNew) => {
    console.log(index, field, value, isNew);
    if (isNew) {
      setNewRows((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          [field]: field === "ride_type" ? value : +value,
        };
        return updated;
      });
    } else {
      setRideTypePrices((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          [field]: +value,
          isEdited: true,
        };
        return updated;
      });
    }
  };

  const handleAddRow = () => {
    setNewRows((prev) => [
      ...prev,
      {
        ride_type: "",
        base_fare: "",
        fare_per_km: "",
        fare_per_min: "",
        minimum_fare: "",
        waiting_charges_per_min: "",
      },
    ]);
  };

  const validateRow = (row) => {
    return [
      "base_fare",
      "fare_per_km",
      "fare_per_min",
      "minimum_fare",
      "waiting_charges_per_min",
    ].every(
      (field) =>
        row[field] !== "" && !isNaN(row[field]) && Number(row[field]) >= 0
    );
  };

  const validateButton = (row) => {
    return [
      "base_fare",
      "fare_per_km",
      "fare_per_min",
      "minimum_fare",
      "waiting_charges_per_min",
    ].every((field) => Number(row[field]) > 0);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deletePrice(id).unwrap();
      showSnackbar(
        response?.message || "Ride type price deleted successfully!",
        "success"
      );
    } catch (error) {
      showSnackbar(
        error?.data?.message || "Failed to delete ride type price!",
        "error"
      );
    }
  };

  const handleUpdate = async (index) => {
    const { id, isEdited, ...data } = rideTypePrices[index];
    console.log(isEdited);
    if (!validateRow(data))
      return alert(
        "Please ensure all fields contain non-negative numeric values."
      );
    delete data.createdAt;
    delete data.updatedAt;
    delete data.is_deleted;

    if (zoneId) {
      data.zone_id = zoneId;
      data.ride_type_price = "ZONE_BASE";
    } else {
      delete data.zone_id;
      data.city_id = cityId;
      data.ride_type_price = "CITY_BASE";
    }

    try {
      const response = await updatePrice({ data, id }).unwrap();
      showSnackbar(
        response?.message || "Ride type price updated successfully!",
        "success"
      );
    } catch (error) {
      showSnackbar(
        error?.data?.message || "Failed to update ride type price!",
        "error"
      );
    }
  };

  const handleCreate = async () => {
    const body = newRows.map((item) =>
      zoneId
        ? {
            ...item,
            city_id: areaDetails?.city_id?.id,
            country_id: areaDetails?.country_id?.id,
            zone_id: areaDetails?.id,
            ride_type_price: "ZONE_BASE",
            additional_charge_type: "FIXED",
            additional_charges: 0,
            discount_type: "PERCENTAGE",
            discount_value: 0,
          }
        : {
            ...item,
            city_id: areaDetails?.id,
            country_id: areaDetails?.country_id?.id,
            ride_type_price: "CITY_BASE",
            additional_charge_type: "FIXED",
            additional_charges: 0,
            discount_type: "PERCENTAGE",
            discount_value: 0,
          }
    );
    try {
      const response = await addPrices(body).unwrap();
      showSnackbar(
        response?.message || "Ride type prices added successfully!",
        "success"
      );
    } catch (error) {
      showSnackbar(
        error?.data?.message || "Failed to add ride type prices!",
        "error"
      );
    }
    setNewRows([]);
  };

  const handleClearNewRows = () => setNewRows([]);

  const usedRideTypes = [...(rideTypePrices || []), ...newRows].map(
    (row) => row.ride_type
  );

  if (rideTypePricesError || rideTypesError) {
    const error = rideTypePricesError || rideTypesError;
    return (
      <p className="text-lg text-red-400 font-bold">
        {error.message || "Error"}
      </p>
    );
  }

  if (rideTypePricesLoading || rideTypesLoading) {
    return <LoadingAnimation width={500} height={500} />;
  }

  return (
    <>
      <p className="text-gray font-redhat text-base font-semibold">
        {zoneId ? "Dashboard > " : "Location > "}
        <span className="text-black">{zoneId ? "Zones" : "Add Location"}</span>
        {" > "}
        <span className="text-black">
          {zoneId ? "Update zone" : "Update City"}
        </span>
      </p>

      <div className="flex items-center gap-4 mt-8">
        <img
          src={BackArrow}
          alt="BackArrow"
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <p className="font-redhat font-semibold text-2xl">
          {zoneId
            ? `Update or add prices for zone`
            : `Update or add prices for city`}
        </p>
      </div>

      {rideTypePrices?.length === 0 && (
        <p className="text-red-400 text-lg font-bold my-8">
          Not prices for any ride types added yet!
        </p>
      )}
      {(rideTypePrices || []).map((row, index) => (
        <div key={row._id} className="flex space-x-2 mb-4 mt-8">
          <TextField
            value={
              rideTypes.find((type) => type._id === row.ride_type)?.name || ""
            }
            disabled
          />
          {[
            "base_fare",
            "fare_per_km",
            "fare_per_min",
            "minimum_fare",
            "waiting_charges_per_min",
          ].map((field) => (
            <TextField
              key={field}
              label={field.replace(/_/g, " ").toUpperCase()}
              value={row[field]}
              type="number"
              onChange={(e) => handleInputChange(index, field, e.target.value)}
              inputProps={{ step: 0.1, min: 0 }}
            />
          ))}
          <IconButton
            onClick={() => handleUpdate(index)}
            disabled={!row.isEdited}
            sx={{
              color: row.isEdited ? "#0A84C1" : "grey",
            }}
          >
            {isUpdatingPrice ? (
              <LoadingAnimation width={30} height={30} />
            ) : (
              <Save />
            )}
          </IconButton>
          <IconButton onClick={() => handleDelete(row.id)}>
            {isDeletingPrice ? (
              <LoadingAnimation width={30} height={30} />
            ) : (
              <Delete sx={{ color: "red" }} />
            )}
          </IconButton>
        </div>
      ))}
      {newRows.map((row, index) => {
        const availableRideTypes = rideTypes.filter(
          (type) =>
            !usedRideTypes.includes(type._id) || type._id === row.ride_type
        );

        return (
          <div key={index} className="flex space-x-2 mb-4 mt-8">
            <TextField
              sx={{ width: "230px" }}
              select
              value={row?.ride_type?.toString() || ""}
              onChange={(e) =>
                handleInputChange(index, "ride_type", e.target.value, true)
              }
            >
              {availableRideTypes.map((type) => (
                <MenuItem key={type._id} value={type._id}>
                  {type?.name}
                </MenuItem>
              ))}
            </TextField>
            {[
              "base_fare",
              "fare_per_km",
              "fare_per_min",
              "minimum_fare",
              "waiting_charges_per_min",
            ].map((field) => (
              <TextField
                key={field}
                label={field.replace(/_/g, " ").toUpperCase()}
                value={row[field]}
                onChange={(e) =>
                  handleInputChange(index, field, e.target.value, true)
                }
                type="number"
                inputProps={{ step: 0.1, min: 0 }}
              />
            ))}
          </div>
        );
      })}
      <div className="flex justify-between">
        {/* {rideTypePrices?.length + newRows < rideTypes.length && ( */}
        <Button
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            color: "black",
            textTransform: "none",
            fontWeight: 400,
            fontSize: "14px",
          }}
          onClick={handleAddRow}
        >
          Click to add row
        </Button>
        {/* )} */}
        {newRows.length > 0 && (
          <div className="flex gap-4 ml-auto">
            <Button
              variant="outlined"
              sx={{
                color: "black",
                borderColor: "black",
                textTransform: "none",
              }}
              onClick={handleClearNewRows}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "black", textTransform: "none" }}
              disabled={!newRows.every(validateButton)}
              onClick={handleCreate}
            >
              {isAddingPrices ? (
                <LoadingAnimation width={30} height={30} />
              ) : (
                "Add Prices"
              )}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default UpdateRideTypePrices;
