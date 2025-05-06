import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCreatedAt } from "../utils/dates";
import { useSnackbar } from "../context/SnackbarProvider";
import {
  useDeleteZoneMutation,
  useFetchZonesQuery,
  useToggleZoneMutation,
} from "../services/locationApi";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  TableCell,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LoadingAnimation from "../components/common/LoadingAnimation";
import InputSearchBar from "../components/common/InputSearchBar";
import EntityPaginatedTable from "../components/common/EntityPaginatedTable";
import DeleteConfirmationModal from "../components/ui/modals/DeleteConfirmationModal";
import DeactivateConfirmationModal from "@/components/ui/modals/DeactivateConfirmationModal";
import BackArrow from "../assets/backArrow.svg";

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
  "Total area",
  "Zones status",
  "Options",
];

const AllZones = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedZone, setSelectedZone] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const showSnackbar = useSnackbar();

  const [toggleZone, { isLoading: isTogglingZone }] = useToggleZoneMutation();
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
    try {
      const res = await toggleZone(zoneId).unwrap();
      showSnackbar(
        res?.message || "Zone status updated successfully!",
        "success"
      );
    } catch (error) {
      showSnackbar(
        error?.data?.message || "Failed to update zone status",
        "error"
      );
    } finally {
      setSelectedZone(null);
      setIsDeactivateModalOpen(false);
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
      setIsDeleteModalOpen(false);
      setSelectedZone(null);
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
  };

  const renderZoneRow = (zone) => {
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
          {zone?.total_area
            ? (zone?.total_area / 1_000_000).toFixed(2) + " sqkm"
            : "0 sqkm"}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          <Switch
            checked={zone?.is_active}
            onClick={(event) => event.stopPropagation()}
            onChange={() => {
              setSelectedZone(zone);
              setIsDeactivateModalOpen(true);
            }}
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
          {zone?.is_active ? "On" : "Off"}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
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
                  handleMenuClose();
                  setIsDeleteModalOpen(true);
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </>
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

      {/* <div className="flex mt-8 gap-4">
        <img
          src={BackArrow}
          alt="BackArrow"
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        /> */}
      <p className="font-redhat font-semibold text-2xl mt-8">All zones</p>
      {/* </div> */}

      <div className="mt-4 flex justify-between items-center">
        <p className="font-sans font-normal text-xl">
          Review your all zones list, fill in the below details and submit.
        </p>
        <div
          className="py-2 px-4 text-base font-redhat bg-[#000000] text-white rounded-[56px] flex cursor-pointer"
          onClick={() => navigate("/zones/add")}
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

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteZone}
        message="The zone will be deleted from the Super Admin panel."
        loading={isDeletingZone}
      />

      <DeactivateConfirmationModal
        open={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={() => handleToggleStatus(selectedZone?.id)}
        message="This zone's status will be toggled."
        loading={isTogglingZone}
      />
    </>
  );
};

export default AllZones;
