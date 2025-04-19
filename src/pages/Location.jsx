import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAddCountryMutation,
  useDeleteCityMutation,
  useDeleteCountryMutation,
  useFetchCitiesQuery,
  useFetchCountriesQuery,
  useToggleCityMutation,
  useToggleCountryMutation,
} from "../services/locationApi";
import { useSnackbar } from "../context/SnackbarProvider";
import { formatCreatedAt } from "../utils/dates";
import {
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Tab,
  TableCell,
  Tabs,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCountryModal from "../components/AddCountryModal";
import LoadingAnimation from "../components/common/LoadingAnimation";
import InputSearchBar from "../components/common/InputSearchBar";
import EntityPaginatedTable from "../components/common/EntityPaginatedTable";

const cityHeaders = [
  "City",
  "Total zones",
  "Status",
  "City area",
  "Last edited",
  "Options",
];

const countryHeaders = [
  "Country",
  "Operating cities",
  "ISO code",
  "Currency",
  "Status",
  "Options",
];

const AddLocation = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [statusOverrides, setStatusOverrides] = useState({});
  const showSnackbar = useSnackbar();

  const {
    data: cityData,
    error: cityError,
    isLoading: cityLoading,
  } = useFetchCitiesQuery({ page });
  const {
    data: countryData,
    error: countryError,
    isLoading: countryLoading,
  } = useFetchCountriesQuery({ page });
  const [deleteCity, { isLoading: isDeletingCity }] = useDeleteCityMutation();
  const [deleteCountry, { isLoading: isDeletingCountry }] =
    useDeleteCountryMutation();
  const [toggleCity] = useToggleCityMutation();
  const [toggleCountry] = useToggleCountryMutation();
  const [addCountry, { isLoading: isAddingCountry }] = useAddCountryMutation();

  const {
    results: allCities,
    totalPages: totalCityPages,
    isNextPage: isCityNextPage,
    isPreviousPage: isCityPreviousPage,
  } = cityData?.data?.cities || {};

  const {
    results: allCountries,
    totalPages: totalCountryPages,
    isNextPage: isCountryNextPage,
    isPreviousPage: isCountryPreviousPage,
  } = countryData?.data?.countries || {};

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStatusOverrides((prev) => {
        const cleaned = {};
        for (const [key, value] of Object.entries(prev)) {
          if (!value.locked) continue;
          cleaned[key] = value;
        }
        return cleaned;
      });
    }, 3000);

    return () => clearTimeout(timeout);
  }, [statusOverrides]);

  const handleAddCountry = async (country) => {
    if (!country) return;
    try {
      const response = await addCountry({
        country,
      }).unwrap();
      showSnackbar(
        response?.message || "Country added successfully!",
        "success"
      );
      setIsModalOpen(false);
    } catch (error) {
      showSnackbar(error?.data?.message || "Failed to add country!", "error");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDeleteLocation = async (isCity, countryId) => {
    try {
      const response = await (isCity
        ? deleteCity({
            cityId: selectedCity?.id,
          }).unwrap()
        : deleteCountry({
            countryId,
          }).unwrap());
      showSnackbar(
        response?.message || "City deleted successfully!",
        "success"
      );
      setIsModalOpen(false);
    } catch (error) {
      showSnackbar(error?.data?.message || "Failed to delete city!", "error");
    } finally {
      handleMenuClose();
    }
  };

  const handleToggleStatus = async (id, isCity) => {
    const list = isCity ? allCities : allCountries;
    const originalItem = list.find((item) => item.id === id);
    const newStatus = !originalItem?.is_active;

    // Set optimistic status
    setStatusOverrides((prev) => ({
      ...prev,
      [id]: { status: newStatus, locked: true },
    }));

    try {
      const res = await (isCity
        ? toggleCity({ cityId: id }).unwrap()
        : toggleCountry({ countryId: id }).unwrap());

      showSnackbar(res?.message || "Status updated!", "success");

      // Keep the override but unlock it (in case API response differs, we still control it for now)
      setStatusOverrides((prev) => ({
        ...prev,
        [id]: { status: newStatus, locked: false },
      }));
    } catch (err) {
      showSnackbar(err?.data?.message || "Failed to update status", "error");

      // Revert the override
      setStatusOverrides((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const handleMenuOpen = (event, city) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom, left: rect.left });
    setMenuAnchor(event.currentTarget);
    setSelectedCity(city);
  };

  const handleMenuClose = (event) => {
    event?.stopPropagation();
    setMenuAnchor(null);
    setSelectedCity(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderCityRow = (city) => {
    const isActive = statusOverrides[city.id]
      ? statusOverrides[city.id].status
      : city?.is_active;
    return (
      <>
        <TableCell>
          {city?.name || <p className="text-red-500">No name</p>}
        </TableCell>
        <TableCell>
          <p>{city?.total_zones}</p>
        </TableCell>
        <TableCell>
          <Switch
            checked={
              statusOverrides[city.id]
                ? statusOverrides[city.id].status
                : city?.is_active
            }
            onClick={(event) => event.stopPropagation()}
            onChange={() => handleToggleStatus(city?.id, true)}
            sx={{
              "& .MuiSwitch-track": {
                backgroundColor: city?.is_active ? "#22cfcf" : "red",
                opacity: 1,
              },
              "& .Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#22cfcf",
                opacity: 1,
              },
            }}
          />
          {isActive ? "On" : "Off"}
        </TableCell>
        <TableCell>
          <p>
            {city?.total_area
              ? (city?.total_area / 1_000_000).toFixed(2) + " sqkm"
              : "0 sqkm"}
          </p>
        </TableCell>
        <TableCell>
          {city?.updatedAt
            ? formatCreatedAt(city?.updatedAt)
            : formatCreatedAt(city?.createdAt)}
        </TableCell>
        <TableCell>
          {isDeletingCity ? (
            <CircularProgress size={20} style={{ color: "grey" }} />
          ) : (
            <>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  handleMenuOpen(event, city);
                }}
              >
                <MoreHorizIcon />
              </IconButton>
              <Menu
                anchorReference="anchorPosition"
                anchorPosition={{
                  top: menuPosition.top,
                  left: menuPosition.left,
                }}
                open={Boolean(menuAnchor)}
                onClose={(event) => handleMenuClose(event)}
                PaperProps={{
                  elevation: 2,
                  sx: { boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)" },
                }}
              >
                <MenuItem
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/location/city/${selectedCity?.id}`);
                  }}
                >
                  Update Polygon
                </MenuItem>
                <MenuItem
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(
                      `/location/city/${selectedCity?.id}/update-prices`
                    );
                  }}
                >
                  Update Prices
                </MenuItem>
                <MenuItem
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDeleteLocation(true);
                  }}
                >
                  Delete
                </MenuItem>
              </Menu>
            </>
          )}
        </TableCell>
      </>
    );
  };

  const renderCountryRow = (country) => {
    const isActive = statusOverrides[country.id]
      ? statusOverrides[country.id].status
      : country?.is_active;
    return (
      <>
        <TableCell>
          {country?.name || <p className="text-red-500">No name</p>}
        </TableCell>
        <TableCell>{country?.total_cities}</TableCell>
        <TableCell>{country?.iso_code}</TableCell>
        <TableCell>{country?.currency}</TableCell>
        <TableCell>
          <Switch
            checked={
              statusOverrides[country.id]
                ? statusOverrides[country.id].status
                : country?.is_active
            }
            onChange={() => handleToggleStatus(country?.id, false)}
            sx={{
              "& .MuiSwitch-track": {
                backgroundColor: country?.is_active ? "#22cfcf" : "red",
                opacity: 1,
              },
              "& .Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#22cfcf",
                opacity: 1,
              },
            }}
          />
          {isActive ? "On" : "Off"}
        </TableCell>
        <TableCell>
          {isDeletingCountry ? (
            <CircularProgress size={20} style={{ color: "grey" }} />
          ) : (
            <DeleteIcon
              className="text-red-600"
              onClick={() => handleDeleteLocation(false, country?.id)}
            />
          )}
        </TableCell>
      </>
    );
  };

  if (countryError || cityError) {
    return (
      <p className="text-lg font-bold font-redhat text-red-400">
        {countryError?.data?.message || "Error in fetching location details!"}
        {cityError?.data?.message || "Error in fetching location details!"}
      </p>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center font-redhat text-base font-semibold ">
        <p className="text-gray">
          {"Location > "}
          <span className="text-black">Add Location</span>
        </p>

        <InputSearchBar />
      </div>

      <div className="flex justify-between mt-8">
        <p className="font-redhat font-semibold text-2xl">
          All added locations preview
        </p>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            sx={{
              borderColor: "black",
              color: "black",
              textTransform: "none",
              padding: "5px 40px",
              borderRadius: "20px",
              fontSize: "14px",
              "&:hover": {
                borderColor: "black",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            onClick={() => setIsModalOpen(true)}
          >
            Add new country
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "black",
              color: "white",
              textTransform: "none",
              padding: "5px 40px",
              borderRadius: "20px",
              fontSize: "14px",
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
            onClick={() => navigate("/location/city/add")}
          >
            Add new city
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          borderBottom: "1px solid #d3d3d3",
          width: "fit-content",
          marginTop: "30px",
          ".MuiTab-root": {
            textTransform: "none",
            fontWeight: 500,
            color: "#9e9e9e",
          },
          ".Mui-selected": { color: "#1976d2", fontWeight: "bold" },
          ".MuiTabs-indicator": { backgroundColor: "#1976d2" },
        }}
      >
        <Tab label="All cities" />
        <Tab label="All countries" />
      </Tabs>

      {cityLoading || countryLoading ? (
        <LoadingAnimation width={500} height={500} />
      ) : (
        <>
          {activeTab === 0 && (
            <EntityPaginatedTable
              headers={cityHeaders}
              rows={allCities}
              renderRow={(city) => renderCityRow(city)}
              emptyMessage="No cities yet!"
              onRowClick={(city) => navigate(`/location/city/${city?._id}`)}
              isPreviousPage={isCityPreviousPage}
              isNextPage={isCityNextPage}
              page={page}
              setPage={setPage}
              totalPages={totalCityPages}
            />
          )}
          {activeTab === 1 && (
            <EntityPaginatedTable
              headers={countryHeaders}
              rows={allCountries}
              renderRow={(country) => renderCountryRow(country)}
              emptyMessage="No countries yet!"
              onRowClick={() => console.log("Country clicked")}
              isPreviousPage={isCountryPreviousPage}
              isNextPage={isCountryNextPage}
              page={page}
              setPage={setPage}
              totalPages={totalCountryPages}
            />
          )}
        </>
      )}

      <AddCountryModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCountry={handleAddCountry}
        loading={isAddingCountry}
      />
    </>
  );
};

export default AddLocation;
