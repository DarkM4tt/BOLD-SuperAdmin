import { useEffect, useState } from "react";
import { CircularProgress, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DocumentModal = ({ open, onClose, documentUrl, documentName }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (documentUrl) {
      setLoading(true);
      const img = new Image();
      img.src = documentUrl;
      img.onload = () => setLoading(false);
      img.onerror = () => setLoading(false);
    }
  }, [documentUrl]);

  const isPdf = documentUrl?.endsWith(".pdf");

  return (
    <Modal open={open} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl">
          <div className="flex justify-between items-center p-4 border-b">
            <p className="font-bold text-lg">{documentName}</p>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className="p-4 flex justify-center items-center min-h-[500px]">
            {loading && <CircularProgress />}
            {!loading && isPdf ? (
              <iframe
                src={documentUrl}
                className="w-full h-[500px]"
                title={documentName}
              />
            ) : (
              !loading && (
                <img
                  src={documentUrl}
                  alt={documentName}
                  className="max-w-full max-h-[500px]"
                />
              )
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentModal;
