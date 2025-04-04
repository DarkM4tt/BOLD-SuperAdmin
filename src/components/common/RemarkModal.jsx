import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { formatDate } from "../../utils/dates";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "../../assets/pdf.png";
import LoadingAnimation from "./LoadingAnimation";

const RemarksModal = ({
  selectedDocument,
  remarks,
  setRemarks,
  buttonLoading,
  open,
  handleClose,
  handleAddRemarks,
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
        Remarks
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        {!selectedDocument && (
          <div className="my-4 mx-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select the document
            </label>
            <Select
              fullWidth
              displayEmpty
              sx={{
                height: 42,
                fontSize: 14,
                backgroundColor: "white",
                borderRadius: "6px",
                border: "1px solid #D1D5DB",
                "& .MuiSelect-select": { p: "10px" },
              }}
            >
              <MenuItem value="">Select document</MenuItem>
            </Select>
          </div>
        )}

        <p className="ml-2">
          Set <span className="font-semibold">{selectedDocument?.name}</span>{" "}
          status to{" "}
          <span className="font-semibold">{selectedDocument?.status}!</span>
        </p>
        <label className="mt-8 ml-3 block text-sm font-medium text-gray-700 mb-2">
          Please write the remarks
        </label>
        <div className="mb-8 bg-[#F3F3F3] rounded-lg mx-3 p-4">
          {selectedDocument?.remarks && (
            <>
              <p className="text-lg font-semibold text-gray-700 max-w-[70%]">
                {selectedDocument?.remarks}
              </p>
              <p className="text-sm text-gray-700 max-w-[70%]">
                {selectedDocument?.updatedAt
                  ? formatDate(selectedDocument?.updatedAt)
                  : formatDate(selectedDocument?.createdAt)}
              </p>
            </>
          )}
          <div className="flex flex-row-reverse items-center gap-2 mt-2">
            <span className="text-sm cursor-pointer">
              {selectedDocument?.name}
            </span>
            <img src={PictureAsPdfIcon} alt="PictureAsPdfIcon" />
          </div>

          <div className="mt-8 flex items-center rounded-2xl px-2 py-1 bg-white">
            <TextField
              fullWidth
              placeholder="Write your text here"
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
              onClick={handleAddRemarks}
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

export default RemarksModal;
