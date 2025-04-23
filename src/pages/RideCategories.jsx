import { useEffect, useMemo, useState } from "react";
import { Box, Button, Checkbox, TextField, Typography } from "@mui/material";
import {
  useAddRideCategoryMutation,
  useDeleteRideCategoryMutation,
  useFetchRideCategoriesQuery,
  useFetchRideTypeAssignmentsQuery,
  useFetchRideTypesQuery,
  useUpdateRideTypeAssignmentsMutation,
} from "../services/rideApi";
import { useSnackbar } from "../context/SnackbarProvider";
import InputSearchBar from "../components/common/InputSearchBar";
import LoadingAnimation from "../components/common/LoadingAnimation";

const RideCategories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [modified, setModified] = useState({});
  const [assignments, setAssignments] = useState({});
  const showSnackbar = useSnackbar();

  const {
    data: rideCategoriesData,
    isLoading: rideCategoriesLoading,
    error: rideCategoriesError,
  } = useFetchRideCategoriesQuery();
  const {
    data: rideTypesData,
    isLoading: rideTypesLoading,
    error: rideTypesError,
  } = useFetchRideTypesQuery();
  const { data: rideTypesAssignmentsData } = useFetchRideTypeAssignmentsQuery();

  const rideTypes = rideTypesData?.data?.rideTypes?.results;
  const rideCategories = rideCategoriesData?.data?.rideTypeCategories?.results;
  const rideTypesAssignments = useMemo(
    () => rideTypesAssignmentsData?.data?.rideTypeAssignments?.results || [],
    [rideTypesAssignmentsData]
  );

  const [addRideCategory, { isLoading: isAddingCategory }] =
    useAddRideCategoryMutation();
  const [deleteRideCategory, { isLoading: isDeletingCategory }] =
    useDeleteRideCategoryMutation();
  const [updateRideTypesAssignment, { isLoading: isUpdatingAssignments }] =
    useUpdateRideTypeAssignmentsMutation();

  useEffect(() => {
    const initialAssignments = {};
    rideTypesAssignments?.forEach((assignment) => {
      initialAssignments[assignment.ride_type_category?.id] = new Set(
        assignment.ride_types.map((type) => type._id)
      );
    });
    setAssignments(initialAssignments);
  }, [rideTypesAssignments]);

  const handleAddCategory = async () => {
    const trimmedCategoryName = categoryName.trim();
    try {
      const result = await addRideCategory(trimmedCategoryName).unwrap();
      showSnackbar(
        result?.message || "Ride category created successfully!",
        "success"
      );
      setCategoryName("");
    } catch (error) {
      showSnackbar(
        error?.data?.message || "Failed to create ride category!",
        "error"
      );
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const result = await deleteRideCategory(categoryId).unwrap();
      showSnackbar(
        result?.message || "Ride category deleted successfully!",
        "success"
      );
    } catch (error) {
      showSnackbar(
        error?.data?.message || "Failed to delete ride category!",
        "error"
      );
    }
  };

  const handleToggle = (categoryId, typeId) => {
    const updatedSet = new Set(assignments[categoryId] || []);
    if (updatedSet.has(typeId)) {
      updatedSet.delete(typeId);
    } else {
      updatedSet.add(typeId);
    }
    setAssignments({ ...assignments, [categoryId]: updatedSet });
    setModified({ ...modified, [categoryId]: true });
  };

  const handleSave = async (categoryId) => {
    const typeIds = Array.from(assignments[categoryId] || []);
    const payload = {
      ride_type_category: categoryId,
      ride_types: typeIds.map((id) => ({ id })),
    };
    console.log(payload);
    try {
      const result = await updateRideTypesAssignment(payload).unwrap();
      showSnackbar(
        result?.message || "Ride assignments updated successfully!",
        "success"
      );
      setModified({ ...modified, [categoryId]: false });
    } catch (error) {
      showSnackbar(
        error?.data?.message || "Failed to update ride assignments!",
        "error"
      );
    }
  };

  if (rideCategoriesLoading || rideTypesLoading) {
    return <LoadingAnimation width={500} height={500} />;
  }

  if (rideCategoriesError || rideTypesError) {
    return (
      <p className="text-red-400 font-bold text-lg font-redhat">
        {rideCategoriesError?.data?.message ||
          rideTypesError?.data?.message ||
          "Failed to fetch data!"}
      </p>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center font-redhat text-base font-semibold ">
        {"> Ride Categories"}
        <InputSearchBar />
      </div>

      <div className="mt-8">
        <p className="font-redhat font-bold text-2xl">Category Details</p>
        <p className="font-sans text-base font-normal text-textGray">
          Here you can see the details of the ride categories.
        </p>
      </div>

      <p className="font-sans font-semibold text-2xl mt-8">
        Enter details to make the categories
      </p>

      <div className="flex gap-10 mt-8 items-center">
        <div className="flex flex-col gap-2">
          <p className="font-redhat font-semibold text-base">
            Write category name
          </p>
          <TextField
            type="text"
            placeholder="Enter category name (Regular , XL, Etc)"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            sx={{
              width: "30rem",
            }}
          />
        </div>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "black",
            borderRadius: "8px",
            padding: "10px 30px",
            marginTop: "1.5rem",
            fontSize: "16px",
          }}
          fulllWidth
          disabled={categoryName?.trim()?.length < 2}
          onClick={handleAddCategory}
          loading={isAddingCategory}
        >
          {"+ Add Category"}
        </Button>
      </div>

      <div className="mt-12">
        <p className="font-redhat font-bold text-2xl">Added categories</p>
        <p className="font-sans text-base font-normal text-textGray">
          The added categories will receive the respective ride type in the app.
        </p>
      </div>

      {rideCategories.map((category) => (
        <div
          key={category.id}
          className="flex items-center my-10 border-b-[1px] border-gray-300"
        >
          <div className="flex items-center justify-between gap-10 w-full">
            <p className="font-bold text-2xl font-redhat w-52">
              {category.name}
            </p>
            <div className="flex items-center flex-wrap gap-4">
              {rideTypes.map((type) => (
                <div
                  className="flex whitespace-nowrap items-center"
                  key={type._id}
                >
                  <Checkbox
                    key={type._id}
                    checked={(assignments[category.id] || new Set()).has(
                      type._id
                    )}
                    onChange={() => handleToggle(category.id, type._id)}
                    sx={{
                      color: "#777777",
                      "&.Mui-checked": {
                        color: "#18C4B8",
                      },
                    }}
                  />
                  <p>
                    {type?.name
                      ?.toLowerCase()
                      ?.split(" ")
                      ?.map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      ?.join(" ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="contained"
            disabled={!modified[category.id]}
            onClick={() => handleSave(category.id)}
            sx={{ ml: 2, backgroundColor: "gray", textTransform: "none" }}
            loading={isUpdatingAssignments}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDeleteCategory(category.id)}
            sx={{ ml: 2, textTransform: "none" }}
            loading={isDeletingCategory}
          >
            Delete
          </Button>
        </div>
      ))}
    </>
  );
};

export default RideCategories;
