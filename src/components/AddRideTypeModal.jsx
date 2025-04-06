import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import { useSnackbar } from "../context/SnackbarProvider";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoadingAnimation from "./common/LoadingAnimation";

const AddRideTypeModal = ({
  rideTypes,
  buttonLoading,
  open,
  handleClose,
  vehicleId,
}) => {
  const [selectedRideTypeId, setSelectedRideTypeId] = useState("");
  const [selectedRideTypeName, setSelectedRideTypeName] = useState("");
  const showSnackbar = useSnackbar();

  const handleChange = (event) => {
    setSelectedRideTypeId(event.target.value);
    const rideType = rideTypes?.find(
      (type) => type?._id === event.target.value
    );
    setSelectedRideTypeName(rideType?.type);
  };

  const handleAssignRideType = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/organizations/super-admin/assign-vehicle-category/${vehicleId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type_id: selectedRideTypeId,
            type: selectedRideTypeName,
          }),
          credentials: "include",
        }
      );
      const result = await res?.json();
      if (result?.success) {
        showSnackbar(result?.message, "success");
      } else {
        throw new Error(result?.message);
      }
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          bgcolor: "white",
          boxShadow: 24,
          py: 4,
          px: 3,
          width: "fit-content",
          borderRadius: 1,
        }}
      >
        <div className="flex justify-between gap-8 items-center mb-4">
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Assign vehicle category
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="fuel-type"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Select vehicle category
          </label>
          <TextField
            id="fuel-type"
            select
            placeholder="Select fuel type"
            variant="outlined"
            size="small"
            value={selectedRideTypeId}
            onChange={handleChange}
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
              {rideTypes?.length > 0 ? "Select category" : "No ride types yet!"}
            </MenuItem>
            {rideTypes?.map((type) => (
              <MenuItem key={type?._id} value={type?._id}>
                {type?.name}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <Button
          variant="contained"
          sx={{
            marginTop: "25px",
            px: "60px",
            textTransform: "none",
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
          onClick={handleAssignRideType}
        >
          {buttonLoading ? (
            <LoadingAnimation width={50} height={50} />
          ) : (
            "Assign and approve vehicle"
          )}
        </Button>
      </Box>
    </Modal>
  );
};

export default AddRideTypeModal;
