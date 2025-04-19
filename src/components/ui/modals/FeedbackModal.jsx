import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Avatar,
  Box,
  Typography,
  Rating,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const FeedbackModal = ({
  open,
  onClose,
  customerRating,
  driverRating,
  customer,
  driver,
}) => {
  const [activeTab, setActiveTab] = useState("driver");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const currentRating = activeTab == "driver" ? driverRating : customerRating;
  const currentEntity = activeTab == "driver" ? driver : customer;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box sx={{ p: 2, pb: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography
              onClick={() => handleTabChange("driver")}
              sx={{
                fontWeight: activeTab === "driver" ? 700 : 400,
                fontSize: "1rem",
                color: activeTab === "driver" ? "#000" : "#999",
                cursor: "pointer",
                borderBottom:
                  activeTab === "driver" ? "3px solid #00C29D" : "none",
                pb: "2px",
              }}
            >
              Driver
            </Typography>
            <Typography
              onClick={() => handleTabChange("customer")}
              sx={{
                fontWeight: activeTab === "customer" ? 700 : 400,
                fontSize: "1rem",
                color: activeTab === "customer" ? "#000" : "#999",
                cursor: "pointer",
                borderBottom:
                  activeTab === "customer" ? "3px solid #00C29D" : "none",
                pb: "2px",
              }}
            >
              Customer
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ px: 3, pt: 4, pb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          {currentEntity?.profile_pic ? (
            <img
              src={currentEntity?.profile_pic}
              alt={currentEntity?.full_name || "No name"}
            />
          ) : (
            <Avatar
              src="/avatar.jpg"
              alt={currentEntity?.full_name || "No name"}
            />
          )}
          <Box>
            <Typography sx={{ fontWeight: 600 }}>
              {currentEntity?.full_name || "No name"}
            </Typography>
            {/* <Typography sx={{ fontSize: "0.875rem", color: "#6B7280" }}>
              {currentEntity.experience}
            </Typography> */}
          </Box>
        </Box>

        <Typography sx={{ fontSize: "0.875rem", mb: 2 }}>
          {currentRating?.comment || "No fedback provided!"}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Rating
            name="read-only"
            value={currentRating?.rating}
            precision={1}
            readOnly
            sx={{
              color: "#FFC107",
              "& .MuiRating-iconFilled": {
                color: "#FFC107",
              },
              "& .MuiRating-iconEmpty": {
                color: "#FFC107",
              },
              fontSize: "1.75rem",
            }}
          />
          <Typography sx={{ fontWeight: 500 }}>
            ({currentRating?.rating}.0)
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
