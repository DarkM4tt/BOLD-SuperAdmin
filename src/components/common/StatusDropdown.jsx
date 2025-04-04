import { useEffect, useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const StatusDropdown = ({
  isNew,
  allStatus,
  currentStatus,
  documentId,
  onDocStatusChange,
  onEntityStatusChange,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectedStatusData = allStatus?.find(
    (status) => status.label === selectedStatus
  );

  return (
    <div>
      <Button
        onClick={handleClick}
        endIcon={
          open ? (
            <ExpandMoreIcon
              sx={{ transform: "rotate(180deg)", color: "black" }}
            />
          ) : (
            <ExpandMoreIcon sx={{ color: "black" }} />
          )
        }
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textTransform: "none",
          backgroundColor: isNew ? "#F3F3F3" : "#fff",
          "&:hover": {
            backgroundColor: isNew ? "#F3F3F3" : "#fff",
          },
          borderRadius: isNew ? "10px" : "50px",
          padding: "8px 16px",
        }}
      >
        <span className="flex items-center">
          {!isNew && <p className="text-gray-600">Status :</p>}
          <span
            className={`w-2 h-2 rounded-full ${selectedStatusData?.color} ml-2`}
          ></span>
          <span className={`ml-1 ${selectedStatusData?.text}`}>
            {selectedStatus}
          </span>
        </span>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        SelectProps={{
          displayEmpty: true,
          IconComponent: ExpandMoreIcon,
        }}
        sx={{
          "& .MuiPaper-root": {
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            borderRadius: "10px",
            minWidth: "200px",
            overflow: "hidden",
          },
        }}
      >
        {allStatus
          ?.filter((status) => status.label !== selectedStatus)
          .map((status) => (
            <MenuItem
              key={status.label}
              onClick={() => {
                documentId
                  ? onDocStatusChange(status?.label, documentId)
                  : onEntityStatusChange(status?.label);
                handleClose();
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <span className="text-gray-600">Status :</span>
              <span className={`w-2 h-2 rounded-full ${status.color}`}></span>
              <span className={status?.text}>{status.label}</span>
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};

export default StatusDropdown;
