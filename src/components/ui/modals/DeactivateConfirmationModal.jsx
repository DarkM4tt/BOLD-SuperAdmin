import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@mui/material";

const DeactivateConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  message = "This will be de-activated",
  loading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-red-600 font-semibold">
            Are you sure?
          </DialogTitle>
          <DialogDescription className="text-base text-gray-700 mt-1">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-gray-800 border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <CircularProgress size={20} style={{ color: "grey" }} />
            ) : (
              "Yes, toggle"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivateConfirmationModal;
