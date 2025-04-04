import { useState } from "react";
import { MenuItem, Select } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CustomDropdown = ({ options }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]?.value || "");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="w-[200px]">
      <Select
        value={selectedOption}
        onChange={handleChange}
        displayEmpty
        SelectProps={{
          displayEmpty: true,
          IconComponent: ExpandMoreIcon,
        }}
        renderValue={() => (
          <div className="flex items-center">
            <span className="font-bold text-black">
              {options.find((option) => option.value === selectedOption)
                ?.title || "Select"}
            </span>
          </div>
        )}
        sx={{
          border: "1px solid #d9d9d9",
          borderRadius: "8px",
          "& .MuiSelect-icon": {
            color: "black",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
        fullWidth
        inputProps={{
          className: "py-2 px-4 text-black font-bold",
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.title}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default CustomDropdown;
