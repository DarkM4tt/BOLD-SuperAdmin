import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const InputSearchBar = () => {
  return (
    <TextField
      variant="outlined"
      placeholder="Search anything..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        sx: {
          bgcolor: "#EEEEEE",
          borderRadius: "8px",
          height: "40px",
          width: "250px",
          "& fieldset": { border: "none" },
        },
      }}
    />
  );
};

export default InputSearchBar;
