import React from "react";
import { Button } from "@mui/material";

const Pagination = ({
  pageNumbers,
  page,
  setPage,
  isPreviousPage,
  isNextPage,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-t">
      <div className="flex items-center space-x-2 text-gray-700 text-lg font-medium">
        {pageNumbers.map((pageNumber, index) => (
          <button
            key={index}
            className={`py-1 rounded-md transition-colors ${
              pageNumber === page
                ? "text-[#18C4B8] font-bold"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() =>
              typeof pageNumber === "number" && setPage(pageNumber)
            }
            disabled={pageNumber === "..."}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <div className="flex space-x-2">
        <Button
          disabled={!isPreviousPage}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          variant="outline"
          sx={{
            textTransform: "none",
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
            border: "2px solid #D1D5DB",
            borderRadius: "12px",
            padding: "8px 14px",
            backgroundColor: "white",
            "&:hover": {
              backgroundColor: "white",
              borderColor: "#D1D5DB",
            },
            "&:disabled": {
              color: "#9CA3AF",
              borderColor: "#E5E7EB",
              fontWeight: "400",
            },
          }}
        >
          Previous
        </Button>
        <Button
          disabled={!isNextPage}
          onClick={() => setPage((prev) => prev + 1)}
          variant="outline"
          sx={{
            textTransform: "none",
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
            border: "2px solid #D1D5DB",
            borderRadius: "12px",
            padding: "8px 14px",
            minWidth: "90px",
            backgroundColor: "white",
            "&:hover": {
              backgroundColor: "white",
              borderColor: "#D1D5DB",
            },
            "&:disabled": {
              color: "#9CA3AF",
              borderColor: "#E5E7EB",
              fontWeight: "400",
            },
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
