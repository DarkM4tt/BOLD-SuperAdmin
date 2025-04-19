import { useEffect, useState } from "react";
import {
  Modal,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import LoadingAnimation from "../../common/LoadingAnimation";
import rewardIcon from "../../../assets/reward.png";

const UpdateCouponModal = ({
  open,
  onClose,
  editFormData,
  setEditFormData,
  onUpdate,
  buttonLoading,
  selectedCoupon,
}) => {
  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    if (selectedCoupon) {
      setEditFormData({
        coupon_id: selectedCoupon?.id || "",
        country_id: selectedCoupon?.country_id || "",
        coupon_name: selectedCoupon?.coupon_name || "",
        city_id: selectedCoupon?.city_id || "",
        min_amount: selectedCoupon?.min_amount || 0,
        usage_limit: selectedCoupon?.usage_limit || 0,
        discount_type: selectedCoupon?.discount_type || "FIXED",
        discount_value: selectedCoupon?.discount_value || "",
        coupon_type: selectedCoupon?.coupon_type || "REGULAR",
        valid_from: selectedCoupon?.valid_from || null,
        valid_until: selectedCoupon?.valid_until || null,
        description: selectedCoupon?.description || "",
      });
    }
  }, [selectedCoupon, setEditFormData]);

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    handleChange("discount_value", value ? parseInt(value, 10) : 0);
  };

  const handleChange = (field, value) => {
    setEditFormData((prevData) => {
      const updatedData = { ...prevData, [field]: value };
      setIsFormChanged(
        JSON.stringify(updatedData) !== JSON.stringify(selectedCoupon)
      );
      return updatedData;
    });
  };

  const toggleDiscountType = () => {
    const newType =
      editFormData.discount_type === "FIXED" ? "PERCENTAGE" : "FIXED";
    handleChange("discount_type", newType);
  };

  const isDisabled =
    editFormData?.coupon_name?.trim()?.length < 4 ||
    !editFormData?.country_id ||
    !editFormData?.city_id ||
    editFormData?.usage_limit < 1 ||
    editFormData?.discount_value < 1 ||
    editFormData?.min_amount < 0 ||
    !editFormData?.valid_from ||
    !editFormData?.valid_until ||
    editFormData?.description?.trim()?.length < 3;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="update-coupon-modal">
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
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src={rewardIcon} alt="Reward Icon" className="w-20 mr-3" />
            <Typography variant="h6" className="font-semibold">
              Update Coupon
            </Typography>
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
              value={editFormData?.coupon_name?.toUpperCase()}
              onChange={(e) => handleChange("coupon_name", e.target.value)}
              fullWidth
            />
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
              value={editFormData.min_amount}
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
              value={editFormData.usage_limit}
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
              {editFormData.discount_type === "FIXED" ? "Fixed" : "Percentage"})
            </label>
            <TextField
              type="text"
              id="type"
              value={editFormData.discount_value}
              onChange={handleInputChange}
              placeholder={
                editFormData.discount_type === "PERCENTAGE"
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
                      {editFormData.discount_type === "FIXED" ? (
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
              value={editFormData.coupon_type}
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
              value={editFormData.valid_from}
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
                editFormData.valid_from && date < editFormData.valid_from
              }
              value={editFormData.valid_until}
              onChange={(e) => handleChange("valid_until", e.target.value)}
              fullWidth
              inputProps={{
                min: editFormData.valid_from || "",
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
              value={editFormData.description}
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
              onClick={onUpdate}
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
              disabled={!isFormChanged || isDisabled}
            >
              {buttonLoading ? (
                <LoadingAnimation width={30} height={30} />
              ) : (
                "Update Coupon"
              )}
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default UpdateCouponModal;
