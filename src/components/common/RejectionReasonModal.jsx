import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LoadingAnimation from "./LoadingAnimation";

const RejectionReasonModal = ({
  remarks,
  setRemarks,
  buttonLoading,
  open,
  handleClose,
  handleReject,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{ px: "20px", py: 4 }}
    >
      <DialogTitle
        sx={{
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        Reason for rejection
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <label className="mt-8 ml-3 block text-sm font-medium text-gray-700 mb-2">
          Please write the reason for rejection
        </label>
        <div className="mb-8 bg-[#F3F3F3] rounded-lg mx-3 p-4">
          <div className="mt-8 flex items-center rounded-2xl px-2 py-1 bg-white">
            <TextField
              fullWidth
              placeholder="Write reason for rejection..."
              variant="standard"
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: 14, color: "#374151", backgroundColor: "#fff" },
              }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#2DD4BF",
                color: "white",
                textTransform: "none",
                borderRadius: "20px",
                px: 3,
                py: 1,
                ml: 2,
                fontSize: 14,
                fontWeight: 500,
                boxShadow: "none",
                "&:hover": { backgroundColor: "#25B5A0" },
              }}
              disabled={remarks?.trim()?.length < 10}
              onClick={handleReject}
            >
              {buttonLoading ? (
                <LoadingAnimation width={30} height={30} />
              ) : (
                "Send"
              )}
            </Button>
          </div>
          {remarks?.trim()?.length < 10 && (
            <p className="flex flex-row-reverse text-xs mt-1">
              at least 10 characters!
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RejectionReasonModal;
