import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCreatedAt } from "../utils/dates";
import { useSnackbar } from "../context/SnackbarProvider";
import {
  useDeleteZoneMutation,
  useFetchZonesQuery,
  useToggleZoneMutation,
} from "../features/locationApi";
import {
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  TableCell,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LoadingAnimation from "../components/common/LoadingAnimation";
import InputSearchBar from "../components/common/InputSearchBar";
import BackArrow from "../assets/backArrow.svg";
import EntityPaginatedTable from "../components/common/EntityPaginatedTable";

const getZoneType = (type) => {
  if (type === "RED_ZONE") {
    return "Heat zone";
  } else if (type === "BLUE_ZONE") {
    return "Blue zone";
  }
  return "Yellow zone";
};

const headers = [
  "Zone name",
  "Total rides",
  "Map type",
  "Created on",
  "Zones status",
  "Options",
];

const AllZones = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedZone, setSelectedZone] = useState(null);
  const [statusOverrides, setStatusOverrides] = useState({});
  const showSnackbar = useSnackbar();

  const [toggleZone] = useToggleZoneMutation();
  const [deleteZone, { isLoading: isDeletingZone }] = useDeleteZoneMutation();

  const {
    data: zoneData,
    isLoading,
    error,
  } = useFetchZonesQuery({
    page,
  });

  const { results, totalPages, isNextPage, isPreviousPage } =
    zoneData?.data?.zones || {};

  const handleToggleStatus = async (zoneId) => {
    const originalItem = results.find((item) => item.id === zoneId);
    const newStatus = !originalItem?.is_active;

    // Set optimistic status
    setStatusOverrides((prev) => ({
      ...prev,
      [zoneId]: { status: newStatus, locked: true },
    }));

    try {
      const res = await toggleZone(zoneId).unwrap();
      showSnackbar(
        res?.message || "Zone status updated successfully!",
        "success"
      );

      // Keep the override but unlock it (in case API response differs, we still control it for now)
      setStatusOverrides((prev) => ({
        ...prev,
        [zoneId]: { status: newStatus, locked: false },
      }));
    } catch (error) {
      showSnackbar(
        error?.data?.message || "Failed to update zone status",
        "error"
      );

      // Revert the override
      setStatusOverrides((prev) => {
        const updated = { ...prev };
        delete updated[zoneId];
        return updated;
      });
    }
  };

  const handleDeleteZone = async () => {
    const zoneId = selectedZone?.id;
    try {
      const res = await deleteZone(zoneId).unwrap();
      showSnackbar(res?.message || "Zone deleted successfully!", "success");
    } catch (error) {
      showSnackbar(error?.data?.message || "Failed to delete zone!", "error");
    } finally {
      handleMenuClose();
    }
  };

  const handleMenuOpen = (event, zone) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom, left: rect.left });
    setMenuAnchor(event.currentTarget);
    setSelectedZone(zone);
  };

  const handleMenuClose = (event) => {
    event?.stopPropagation();
    setMenuAnchor(null);
    setSelectedZone(null);
  };

  const renderZoneRow = (zone) => {
    const isActive = statusOverrides[zone.id]
      ? statusOverrides[zone.id].status
      : zone?.is_active;
    return (
      <>
        <TableCell
          sx={{
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          {zone?.name || "No name"}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          {zone?.total_rides || 0}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          {getZoneType(zone?.zone_type) || "No type"}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          {zone?.createdAt && formatCreatedAt(zone?.createdAt)}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          <Switch
            checked={
              statusOverrides[zone.id]
                ? statusOverrides[zone.id].status
                : zone?.is_active
            }
            onClick={(event) => event.stopPropagation()}
            onChange={() => handleToggleStatus(zone?.id)}
            sx={{
              "& .MuiSwitch-track": {
                backgroundColor: zone?.is_active ? "#22cfcf" : "red",
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
        <TableCell
          sx={{
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          {isDeletingZone ? (
            <CircularProgress size={20} style={{ color: "grey" }} />
          ) : (
            <>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  handleMenuOpen(event, zone);
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
                    navigate(`/zones/${selectedZone?.id}`);
                  }}
                >
                  Update Polygon
                </MenuItem>
                <MenuItem
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/zones/${selectedZone?.id}/update-prices`);
                  }}
                >
                  Update Prices
                </MenuItem>
                <MenuItem
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDeleteZone();
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

  if (error) {
    return (
      <p className="text-lg text-red-400 font-bold">
        {error?.data?.message || "Error"}
      </p>
    );
  }

  if (isLoading) {
    return <LoadingAnimation width={500} height={500} />;
  }

  return (
    <>
      <div className="flex justify-between items-center font-redhat text-base font-semibold ">
        {"> Zones"}
        <InputSearchBar />
      </div>

      <div className="flex mt-8 gap-4">
        <img
          src={BackArrow}
          alt="BackArrow"
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <p className="font-redhat font-semibold text-2xl ">All zones</p>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="font-sans font-normal text-xl">
          Review your all zones list, fill in the below details and submit.
        </p>
        <div
          className="py-2 px-4 text-base font-redhat bg-[#000000] text-white rounded-[56px] flex cursor-pointer"
          onClick={() => navigate("NewZone")}
        >
          + Create new zone
        </div>
      </div>

      <Box
        sx={{
          paddingInline: "15px",
          paddingBlock: "30px",
          marginTop: "32px",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          borderRadius: "8px",
        }}
      >
        <p className="font-redhat font-semibold text-2xl">List of all zones</p>
        <EntityPaginatedTable
          headers={headers}
          rows={results}
          renderRow={(zone) => renderZoneRow(zone)}
          emptyMessage="No zones yet!"
          onRowClick={(zone) => navigate(`/zones/${zone?._id}`)}
          isPreviousPage={isPreviousPage}
          isNextPage={isNextPage}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </Box>
    </>
  );
};

export default AllZones;
