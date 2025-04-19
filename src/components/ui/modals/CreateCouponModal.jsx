import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import LoadingAnimation from "../../common/LoadingAnimation";
import rewardIcon from "../../../assets/reward.png";

const CreateCouponModal = ({
  open,
  onClose,
  formData,
  setFormData,
  onSave,
  buttonLoading,
}) => {
  // const [openDate, setOpenDate] = useState(false);
  const [allCities, setAllCities] = useState([]);
  const [allCountries, setAllCountries] = useState([]);

  const isDisabled =
    formData?.coupon_name?.trim()?.length < 4 ||
    !formData?.country_id ||
    !formData?.city_id ||
    formData?.usage_limit < 1 ||
    formData?.discount_value < 1 ||
    formData?.min_amount < 0 ||
    !formData?.valid_from ||
    !formData?.valid_until ||
    formData?.description?.trim()?.length < 3;

  const toggleDiscountType = () => {
    const newType = formData.discount_type === "FIXED" ? "PERCENTAGE" : "FIXED";
    handleChange("discount_type", newType);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    handleChange("discount_value", value ? parseInt(value, 10) : 0);
  };

  const fetchCountries = useCallback(async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_RIDE_URL
        }/super-admin/country/get-countries?page=1&limit=100`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const result = await res?.json();
      if (result?.success) {
        setAllCountries(result?.data?.countries?.results);
      } else {
        throw new Error(result?.message);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchCities = useCallback(async () => {
    if (!formData?.country_id) return;
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_RIDE_URL
        }/super-admin/city/get-cities?page=1&limit=100&country_id=${
          formData?.country_id
        }`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const result = await res?.json();
      if (result?.success) {
        setAllCities(result?.data?.cities?.results);
      } else {
        throw new Error(result?.message);
      }
    } catch (error) {
      console.log(error);
    }
  }, [formData?.country_id]);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  useEffect(() => {
    formData?.country_id && fetchCities();
  }, [fetchCities, formData?.country_id]);

  const handleChange = (field, value) => {
    if (field === "country_id") formData.city_id = "";
    if (field === "valid_from") formData.valid_until = "";
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-fuel-card-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "600px",
          overflowY: "auto",
          bgcolor: "white",
          borderRadius: "8px",
          boxShadow: 24,
          padding: "24px",
        }}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src={rewardIcon} alt="Fuel Gas Icon" className="w-20 mr-3" />
            <div>
              <p className="text-2xl font-redhat font-semibold text-black">
                Create new coupon
              </p>
            </div>
          </div>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-14">
          {/* Coupon name */}
          <div className="flex flex-col">
            <label
              htmlFor="coupon_name"
              className="font-redhat font-semibold text-base mb-4"
            >
              Enter coupon name
            </label>
            <TextField
              id="coupon_name"
              placeholder="Enter name"
              variant="outlined"
              size="small"
              value={formData?.coupon_name?.toUpperCase()}
              onChange={(e) => handleChange("coupon_name", e.target.value)}
              fullWidth
            />
          </div>

          {/* Select coupon country */}
          <div className="flex flex-col">
            <label
              htmlFor="city"
              className="font-redhat font-semibold text-base mb-4"
            >
              Select coupon country
            </label>
            <TextField
              id="city"
              select
              variant="outlined"
              size="small"
              value={formData.country_id}
              onChange={(e) => handleChange("country_id", e.target.value)}
              fullWidth
              SelectProps={{
                displayEmpty: true,
                IconComponent: ExpandMoreIcon,
                MenuProps: {
                  PaperProps: {
                    sx: {
                      maxHeight: 200,
                      overflowY: "auto",
                    },
                  },
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                },
              }}
            >
              {allCountries?.length === 0 ? (
                <MenuItem value="" disabled>
                  Not countries yet!
                </MenuItem>
              ) : (
                <MenuItem value="" disabled>
                  Select country
                </MenuItem>
              )}
              {allCountries?.map((country) => (
                <MenuItem key={country?.id} value={country?.id}>
                  {country?.name}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {/* Select coupon city */}
          <div className="flex flex-col">
            <label
              htmlFor="city"
              className="font-redhat font-semibold text-base mb-4"
            >
              Select coupon city
            </label>
            <TextField
              id="city"
              select
              variant="outlined"
              size="small"
              value={formData.city_id}
              onChange={(e) => handleChange("city_id", e.target.value)}
              fullWidth
              SelectProps={{
                displayEmpty: true,
                IconComponent: ExpandMoreIcon,
                MenuProps: {
                  PaperProps: {
                    sx: {
                      maxHeight: 200,
                      overflowY: "auto",
                    },
                  },
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                },
              }}
            >
              {allCities?.length === 0 ? (
                <MenuItem value="" disabled>
                  Not cities yet!
                </MenuItem>
              ) : (
                <MenuItem value="" disabled>
                  Select city
                </MenuItem>
              )}
              {allCities?.map((city) => (
                <MenuItem key={city?.id} value={city?.id}>
                  {city?.name}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {/* Min amount */}
          <div className="flex flex-col">
            <label
              htmlFor="amount"
              className="font-redhat font-semibold text-base mb-4"
            >
              Min amount (spend in app)
            </label>
            <TextField
              id="amount"
              variant="outlined"
              size="small"
              type="number"
              value={formData.min_amount}
              onChange={(e) => handleChange("min_amount", e.target.value)}
              inputProps={{ step: 1, min: 0 }}
              fullWidth
              placeholder="Enter mininium amount"
            />
          </div>

          {/* For how many rides */}
          <div className="flex flex-col">
            <label
              htmlFor="rides"
              className="font-redhat font-semibold text-base mb-4"
            >
              For how many rides
            </label>
            <TextField
              id="rides"
              variant="outlined"
              size="small"
              type="number"
              value={formData.usage_limit}
              onChange={(e) => handleChange("usage_limit", e.target.value)}
              inputProps={{ step: 1, min: 0 }}
              fullWidth
              placeholder="Enter usage limit"
            />
          </div>

          {/* Select applicable customers */}
          <div className="flex flex-col">
            <label
              htmlFor="customers"
              className="font-redhat font-semibold text-base mb-4"
            >
              Select applicable customers
            </label>
            <TextField
              id="customers"
              placeholder="Select customers"
              variant="outlined"
              size="small"
              value="All customers"
              fullWidth
              disabled
            />
          </div>

          {/* Coupon discount amount */}
          <div className="flex flex-col">
            <label
              htmlFor="type"
              className="font-redhat font-semibold text-base mb-4"
            >
              Coupon discount amount (
              {formData.discount_type === "FIXED" ? "Fixed" : "Percentage"})
            </label>
            <TextField
              type="text"
              id="type"
              value={formData.discount_value}
              onChange={handleInputChange}
              placeholder={
                formData.discount_type === "PERCENTAGE"
                  ? "% percentage"
                  : "€ fixed"
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "45px",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleDiscountType}
                      size="small"
                      sx={{ p: 0, height: "24px", width: "24px" }}
                    >
                      {formData.discount_type === "FIXED" ? (
                        <ChevronRight />
                      ) : (
                        <ChevronLeft />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          {/* Select service type */}
          <div className="flex flex-col">
            <label
              htmlFor="coupon_type"
              className="font-redhat font-semibold text-base mb-4"
            >
              Select service type
            </label>
            <TextField
              id="coupon_type"
              select
              variant="outlined"
              size="small"
              value={formData.coupon_type}
              onChange={(e) => handleChange("coupon_type", e.target.value)}
              fullWidth
              SelectProps={{
                displayEmpty: true,
                IconComponent: ExpandMoreIcon,
              }}
            >
              <MenuItem value="" disabled>
                Select service type
              </MenuItem>
              <MenuItem value="REGULAR">Regular</MenuItem>
              <MenuItem value="INTRACITY">BOLD Miles</MenuItem>
            </TextField>
          </div>

          {/* Coupon valid from */}
          <div className="flex flex-col">
            <label
              htmlFor="validFrom"
              className="font-redhat font-semibold text-base mb-4"
            >
              Coupon valid from
            </label>
            <TextField
              id="validFrom"
              type="date"
              variant="outlined"
              size="small"
              value={formData.valid_from}
              onChange={(e) => handleChange("valid_from", e.target.value)}
              inputProps={{
                min: new Date().toISOString().split("T")[0],
              }}
              fullWidth
            />
          </div>

          {/* Coupon valid until */}
          <div className="flex flex-col">
            <label
              htmlFor="validUntil"
              className="font-redhat font-semibold text-base mb-4"
            >
              Coupon valid until
            </label>
            <TextField
              id="validUntil"
              type="date"
              variant="outlined"
              size="small"
              shouldDisableDate={(date) =>
                formData.valid_from && date < formData.valid_from
              }
              value={formData.valid_until}
              onChange={(e) => handleChange("valid_until", e.target.value)}
              fullWidth
              inputProps={{
                min: formData.valid_from || "",
              }}
            />
          </div>

          {/* Select description */}
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="font-redhat font-semibold text-base mb-4"
            >
              Enter coupon description
            </label>
            <TextField
              id="description"
              type=""
              variant="outlined"
              placeholder="Upto 20 words..."
              size="small"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              fullWidth
              multiline
              sx={{
                "& .MuiInputBase-root": {
                  height: "80px",
                },
              }}
            />
          </div>

          <div className="flex flex-col justify-end">
            <Button
              variant="contained"
              onClick={onSave}
              sx={{
                backgroundColor: "black",
                color: "white",
                textTransform: "none",
                borderRadius: "8px",
                width: "100%",
                paddingX: "16px",
                paddingY: "8px",
                "&:hover": {
                  backgroundColor: "#333333",
                },
              }}
              disabled={isDisabled}
            >
              {buttonLoading ? (
                <LoadingAnimation width={30} height={30} />
              ) : (
                "Add coupon"
              )}
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default CreateCouponModal;
