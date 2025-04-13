import { useState } from "react";
import { countries } from "../utils/countries";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoadingAnimation from "./common/LoadingAnimation";

const AddCountryModal = ({ open, onClose, onAddCountry, loading }) => {
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <Modal open={open} onClose={onClose}>
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
            Please select the country you want to add
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="fuel-type"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Select country to add
          </label>
          <TextField
            id="fuel-type"
            select
            placeholder="Select fuel type"
            variant="outlined"
            size="small"
            value={selectedCountry}
            onChange={handleChange}
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
            {countries.map((country) => (
              <MenuItem key={country?.code} value={country?.code}>
                {country?.label}
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
          onClick={() => onAddCountry(selectedCountry)}
        >
          {loading ? (
            <LoadingAnimation width={30} height={30} />
          ) : (
            "Add country"
          )}
        </Button>
      </Box>
    </Modal>
  );
};

export default AddCountryModal;
