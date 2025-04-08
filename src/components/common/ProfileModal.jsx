import { Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ProfileModal = ({ openProfileModal, setOpenProfileModal, imageUrl }) => {
  return (
    <Dialog
      open={openProfileModal}
      onClose={() => setOpenProfileModal(false)}
      sx={{
        ".MuiDialog-paper": {
          borderRadius: "50%",
          width: 500,
          height: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        },
      }}
    >
      <IconButton
        onClick={() => setOpenProfileModal(false)}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
        }}
      >
        <CloseIcon />
      </IconButton>
      <img
        // src={driverDetails?.profile_pic}
        src={imageUrl}
        alt="driver-pic"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "50%",
        }}
      />
    </Dialog>
  );
};

export default ProfileModal;
