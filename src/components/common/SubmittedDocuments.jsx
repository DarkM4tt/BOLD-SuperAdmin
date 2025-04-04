import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Button,
  CircularProgress,
  Modal,
} from "@mui/material";
import { allDocumentStatus } from "../../utils/enums";
import CloseIcon from "@mui/icons-material/Close";
import StatusDropdown from "./StatusDropdown";

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

const SubmittedDocumentsCard = ({
  entityDocuments,
  onDocStatusChange,
  handleRemarksClick,
}) => {
  const [openDocumentModal, setOpenDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState({});

  const handleOpenDocumentModal = (documentUrl, name) => {
    setSelectedDocument({ url: documentUrl, name });
    setOpenDocumentModal(true);
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ paddingInline: "5%" }}>
        <div className="flex justify-between items-center">
          <p className="font-redhat font-semibold text-base">
            Submitted documents
          </p>
        </div>
        {entityDocuments?.length === 0 && (
          <p className="text-red-400 font-bold text-lg">
            No documents uploaded yet!
          </p>
        )}
        {entityDocuments?.length > 0 && (
          <div className="mt-4 space-y-3 font-redhat text-base max-h-72 overflow-y-auto overflow-x-hidden flex flex-col gap-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100">
            {entityDocuments?.map((document, index) => (
              <div
                key={index}
                className="flex justify-between items-center pr-4"
              >
                <div className="max-w-[80%]">
                  <p
                    className="font-bold underline cursor-pointer break-words"
                    onClick={() =>
                      handleOpenDocumentModal(
                        document?.document,
                        document?.name
                      )
                    }
                  >
                    {document?.name}
                  </p>
                  <StatusDropdown
                    allStatus={allDocumentStatus}
                    currentStatus={document?.status}
                    documentId={document?._id}
                    onDocStatusChange={onDocStatusChange}
                  />
                </div>
                {!(document?.status === "APPROVED") && (
                  <p
                    className="font-redhat font-semibold text-sm underline cursor-pointer"
                    onClick={() => handleRemarksClick(document)}
                  >
                    Remarks
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <div className="px-[5%]">
        <div className="border-t border-dashed border-gray-100 mt-2"></div>
      </div>
      <div className="p-4 mb-2">
        <Button
          variant="outlined"
          sx={{
            textTransform: "none",
            borderColor: "black",
            color: "black",
            borderRadius: "20px",
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              borderColor: "black",
            },
          }}
        >
          Engage operations team
        </Button>
      </div>

      <DocumentModal
        open={openDocumentModal}
        onClose={() => setOpenDocumentModal(false)}
        documentUrl={selectedDocument.url}
        documentName={selectedDocument.name}
      />
    </Card>
  );
};

export default SubmittedDocumentsCard;
