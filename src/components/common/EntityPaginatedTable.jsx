import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import Pagination from "./Pagination";

const EntityPaginatedTable = ({
  headers = [],
  rows = [],
  renderRow,
  emptyMessage = "No data found!",
  onRowClick = () => {},
  page,
  setPage,
  totalPages,
  isPreviousPage,
  isNextPage,
  maxHeight = "30rem",
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
      }}
    >
      <TableContainer sx={{ maxHeight: maxHeight, overflowY: "auto" }}>
        <Table stickyHeader>
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
              <TableCell>S. No.</TableCell>
              {headers.map((header) => (
                <TableCell key={header}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          {rows?.length > 0 ? (
            <TableBody
              sx={{
                "& .MuiTableCell-root": {
                  fontWeight: "600",
                  fontSize: "16px",
                },
              }}
            >
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  onClick={() => onRowClick(row)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                  {renderRow(row)}
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <p className="text-lg text-red-400 font-bold font-redhat p-6">
              {emptyMessage}
            </p>
          )}
        </Table>
      </TableContainer>
      {rows?.length > 0 && (
        <Pagination
          pageNumbers={pageNumbers}
          page={page}
          setPage={setPage}
          isPreviousPage={isPreviousPage}
          isNextPage={isNextPage}
        />
      )}
    </Box>
  );
};

export default EntityPaginatedTable;
