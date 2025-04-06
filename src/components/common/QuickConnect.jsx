import { MenuItem, TextField, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const QuickConnect = () => {
  return (
    <div className="p-6 bg-white rounded-lg">
      {/* Title */}
      <p className="text-base font-semibold text-black font-redhat">
        Quick connect
      </p>

      {/* Dropdown */}
      <TextField
        select
        fullWidth
        variant="outlined"
        size="medium"
        defaultValue=""
        SelectProps={{
          displayEmpty: true,
          IconComponent: ExpandMoreIcon,
        }}
        sx={{
          marginTop: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "white",
            borderColor: "#DDDDDD",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#DDDDDD",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#DDDDDD",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#DDDDDD",
          },
          "& .MuiInputBase-input": {
            fontSize: "16px",
            fontWeight: "400",
            color: "#777777",
          },
          "& .MuiSvgIcon-root": {
            color: "#000000",
          },
        }}
      >
        <MenuItem value="" disabled>
          Select internal team to engage
        </MenuItem>
        <MenuItem value="team1">Team 1</MenuItem>
        <MenuItem value="team2">Team 2</MenuItem>
        <MenuItem value="team3">Team 3</MenuItem>
      </TextField>

      {/* Button */}
      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: "black",
          color: "white",
          textTransform: "none",
          fontSize: "14px",
          padding: "12px",
          fontWeight: 500,
          marginTop: 3,
          borderRadius: "10px",
          "&:hover": {
            backgroundColor: "#333333",
          },
        }}
      >
        Send review request
      </Button>
    </div>
  );
};

export default QuickConnect;
