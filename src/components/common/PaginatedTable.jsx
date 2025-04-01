import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Box,
} from "@mui/material";

const PaginatedTable = ({
  columns,
  data,
  onRowClick,
  isPreviousPage,
  page,
  setPage,
  totalPages,
  isNextPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pageNumbers.push(i);
    } else if (i === page - 2 || i === page + 2) {
      pageNumbers.push("...");
    }
  }

  return (
    <Box
      sx={{
        marginTop: "20px",
        padding: "10px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <TableContainer>
        <Table>
          <TableHead
            sx={{
              "& .MuiTableCell-root": {
                backgroundColor: "#EEEEEE",
                fontWeight: "600",
                fontSize: "16px",
                borderBottom: "none",
              },
              "& .MuiTableCell-root:first-of-type": {
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
              },
              "& .MuiTableCell-root:last-of-type": {
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              },
            }}
          >
            <TableRow>
              {columns.map((header) => (
                <TableCell key={header.key}>{header.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              "& .MuiTableCell-root": {
                fontWeight: "600",
                fontSize: "16px",
              },
            }}
          >
            {data?.length > 0 ? (
              data.map((row, idx) => (
                <TableRow
                  key={row._id || idx}
                  onClick={() => onRowClick && onRowClick(row._id)}
                  sx={{ cursor: onRowClick ? "pointer" : "default" }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableCell>
                <p className="text-red-400 text-lg font-redhat font-semibold">
                  Empty data!
                </p>
              </TableCell>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {data?.length > 0 && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center space-x-2 text-gray-700 text-lg font-medium">
            {pageNumbers.map((pageNumber, index) => (
              <button
                key={index}
                className={`px-2 py-1 rounded-md transition-colors ${
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
            >
              Previous
            </Button>
            <Button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Box>
  );
};

export default PaginatedTable;
