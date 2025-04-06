import { Button } from "@mui/material";

const GenerateReportButton = () => {
  return (
    <Button
      variant="outlined"
      sx={{
        py: "4px",
        px: 4,
        fontSize: "16px",
        fontWeight: 500,
        backgroundColor: "#FF935914",
        borderRadius: "56px",
        color: "#FF9359",
        borderColor: "#FF9359",
        textTransform: "none",
        "&:hover": {
          backgroundColor: "#FF935920",
          borderColor: "#FF9359",
        },
      }}
    >
      Generate report
    </Button>
  );
};

export default GenerateReportButton;
