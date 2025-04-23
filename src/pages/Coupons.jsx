import { useEffect, useState } from "react";
import { useSnackbar } from "../context/SnackbarProvider";
import {
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useGetAllCouponsQuery,
  useToggleStatusMutation,
  useUpdateCouponMutation,
} from "../services/couponApi";
import { CircularProgress, Switch, TableCell } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import InputSearchBar from "../components/common/InputSearchBar";
import UpdateCouponModal from "../components/ui/modals/UpdateCouponModal";
import CreateCouponModal from "../components/ui/modals/CreateCouponModal";
import EntityPaginatedTable from "../components/common/EntityPaginatedTable";
import LoadingAnimation from "../components/common/LoadingAnimation";

const headers = [
  "Coupon name",
  "City",
  "Service type",
  "Limit",
  "Used count",
  "Status",
  "Options",
];

const Rewards = () => {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    country_id: "",
    coupon_name: "",
    city_id: "",
    min_amount: "",
    usage_limit: "",
    discount_type: "FIXED",
    discount_value: "",
    coupon_type: "REGULAR",
    valid_from: null,
    valid_until: null,
    description: "",
  });
  const [editFormData, setEditFormData] = useState({
    coupon_id: "",
    country_id: "",
    coupon_name: "",
    city_id: "",
    min_amount: 0,
    usage_limit: 0,
    discount_type: "FIXED",
    discount_value: "",
    coupon_type: "REGULAR",
    valid_from: null,
    valid_until: null,
    description: "",
  });
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [statusOverrides, setStatusOverrides] = useState({});
  const showSnackbar = useSnackbar();

  const { data, isLoading } = useGetAllCouponsQuery(page);
  const { results, isNextPage, isPreviousPage, totalPages } =
    data?.data?.coupons || {};
  const allCoupons = results;

  const [createCoupon, { isLoading: isAddingCoupon }] =
    useCreateCouponMutation();
  const [toggleStatus] = useToggleStatusMutation();
  const [updateCoupon, { isLoading: isUpdatingCoupon }] =
    useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: isDeletingCoupon }] =
    useDeleteCouponMutation();

  useEffect(() => {
    if (selectedCoupon) {
      setEditFormData((prevData) => ({
        ...prevData,
        ...selectedCoupon,
      }));
    }
  }, [selectedCoupon]);

  const handleEditModalOpen = () => setEditModalOpen(true);

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleUpdateCoupon = async () => {
    const body = {
      country_id: editFormData?.country_id,
      city_id: editFormData?.city_id,
      coupon_name: editFormData?.coupon_name?.trim()?.toUpperCase(),
      description: editFormData?.description?.trim(),
      discount_type: editFormData?.discount_type,
      coupon_type: editFormData?.coupon_type,
      discount_value: +editFormData?.discount_value,
      valid_from: convertToISO(editFormData?.valid_from),
      valid_until: convertToISO(editFormData?.valid_until),
      usage_limit: +editFormData?.usage_limit,
      min_amount: +editFormData?.min_amount,
    };
    try {
      const result = await updateCoupon({
        couponId: editFormData?.coupon_id,
        body,
      }).unwrap();
      if (result?.success) {
        showSnackbar(
          result?.message || "Coupon updated successfully!",
          "success"
        );
      }
    } catch (error) {
      showSnackbar(error?.data?.message || "Failed to update coupon!", "error");
    } finally {
      handleEditModalClose();
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      const res = await deleteCoupon(couponId).unwrap();
      showSnackbar(res?.message || "Coupon deleted successfully!", "success");
    } catch (err) {
      showSnackbar(err?.data?.message || "Failed to delete coupon!", "error");
    }
  };

  const handleToggleStatus = async (couponId) => {
    const originalItem = allCoupons.find((item) => item.id === couponId);
    const newStatus = !originalItem?.is_active;
    setStatusOverrides((prev) => ({
      ...prev,
      [couponId]: { status: newStatus, locked: true },
    }));

    try {
      const result = await toggleStatus(couponId).unwrap();
      if (result?.success) {
        showSnackbar(
          result?.message || "Coupon status updated successfully",
          "success"
        );
        setStatusOverrides((prev) => ({
          ...prev,
          [couponId]: { status: newStatus, locked: false },
        }));
      }
    } catch (error) {
      showSnackbar(
        error?.data?.message || "Failed to update coupon status!",
        "error"
      );
      setStatusOverrides((prev) => {
        const updated = { ...prev };
        delete updated[couponId];
        return updated;
      });
    }
  };

  const convertToISO = (dateStr) => {
    const date = new Date(dateStr);
    date.setUTCHours(18, 30, 0, 0);
    return date.toISOString();
  };

  const handleSave = async () => {
    const body = {
      ...formData,
      min_amount: +formData.min_amount,
      usage_limit: +formData.usage_limit,
      discount_value: +formData.discount_value,
      valid_from: convertToISO(formData.valid_from),
      valid_until: convertToISO(formData.valid_until),
      coupon_name: formData.coupon_name.trim().toUpperCase(),
      description: formData.description.trim(),
    };
    try {
      const result = await createCoupon(body).unwrap();
      if (result?.success) {
        showSnackbar(
          result?.message || "Coupon created successfully!",
          "success"
        );
      }
    } catch (error) {
      showSnackbar(error?.data?.message || "Failed to create coupon!", "error");
    } finally {
      setFormData({
        country_id: "",
        coupon_name: "",
        city_id: "",
        min_amount: 0,
        usage_limit: 0,
        discount_type: "FIXED",
        discount_value: "",
        coupon_type: "REGULAR",
        valid_from: null,
        valid_until: null,
        description: "",
      });
      setModalOpen(false);
    }
  };

  const renderCouponRow = (coupon) => {
    const isActive = statusOverrides[coupon.id]
      ? statusOverrides[coupon.id].status
      : coupon?.is_active;
    return (
      <>
        <TableCell
          sx={{
            fontWeight: "600",
            fontSize: "16px",
            color: "black",
          }}
        >
          {coupon?.coupon_name}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: "600",
            fontSize: "16px",
            color: "black",
          }}
        >
          {coupon?.city_id?.name || "Unknown!"}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: "600",
            fontSize: "16px",
            color: "black",
          }}
        >
          {coupon?.coupon_type === "REGULAR" ? "Regular" : "BOLD Miles"}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: "600",
            fontSize: "16px",
            color: "black",
          }}
        >
          {coupon?.usage_limit}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: "600",
            fontSize: "16px",
            color: "black",
          }}
        >
          {coupon?.used_count}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: "600",
            fontSize: "16px",
            color: "black",
          }}
        >
          <Switch
            checked={
              statusOverrides[coupon.id]
                ? statusOverrides[coupon.id].status
                : coupon?.is_active
            }
            onClick={(event) => event?.stopPropagation()}
            onChange={() => handleToggleStatus(coupon?.id)}
            sx={{
              "& .MuiSwitch-track": {
                backgroundColor: coupon?.is_active ? "#22cfcf" : "red",
                opacity: 1,
              },
              "& .Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#22cfcf",
                opacity: 1,
              },
            }}
          />
          {isActive ? "On" : "Off"}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          {isDeletingCoupon ? (
            <CircularProgress size={20} style={{ color: "grey" }} />
          ) : (
            <DeleteIcon
              className="text-red-600"
              onClick={(event) => {
                event.stopPropagation();
                handleDeleteCoupon(coupon?.id);
              }}
            />
          )}
        </TableCell>
      </>
    );
  };

  if (isLoading) {
    return <LoadingAnimation width={500} height={500} />;
  }

  return (
    <>
      <div className="flex justify-between items-center font-redhat text-base text-gray font-semibold mb-8">
        {"Accounts > Coupons"}
        <InputSearchBar />
      </div>

      <div className="flex justify-between items-center mt-8">
        <p className="font-redhat font-semibold text-2xl">Coupons</p>
        <div
          className="py-2 px-4 text-base font-redhat bg-[#000000] text-white rounded-[56px] cursor-pointer"
          onClick={() => setModalOpen(true)}
        >
          <span className="pr-1">
            {" "}
            <AddIcon fontSize="small" />
          </span>{" "}
          Create new coupon{" "}
        </div>
      </div>

      <EntityPaginatedTable
        headers={headers}
        rows={allCoupons}
        renderRow={(coupon) => renderCouponRow(coupon)}
        emptyMessage="No coupons yet!"
        onRowClick={(coupon) => {
          setSelectedCoupon(coupon);
          handleEditModalOpen();
        }}
        isPreviousPage={isPreviousPage}
        isNextPage={isNextPage}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />

      <CreateCouponModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        buttonLoading={isAddingCoupon}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
      />

      <UpdateCouponModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        buttonLoading={isUpdatingCoupon}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        onUpdate={handleUpdateCoupon}
        selectedCoupon={selectedCoupon}
      />
    </>
  );
};

export default Rewards;
