import { CircularProgress, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../features/authApi";
import { useAuth } from "../context/AuthProvider";
import { useSnackbar } from "../context/SnackbarProvider";

const Header = () => {
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();
  const { setIsAuthenticated } = useAuth();
  const showSnackbar = useSnackbar();

  const handleLogout = async () => {
    try {
      const response = await logout().unwrap();
      if (response?.success) {
        setIsAuthenticated(false);
        navigate("/login");
        showSnackbar(response?.message, "success");
      } else {
        throw new Error(response?.message);
      }
    } catch (error) {
      showSnackbar(error?.data?.message, "error");
    }
  };

  return (
    <div className="flex flex-row justify-between items-center shadow-md px-8 py-2 bg-white">
      <p className="font-redhat text-2xl font-semibold">Owner Access</p>
      <div className="flex flex-row gap-10 items-center">
        <p
          className="font-redhat text-2xl font-semibold px-4 py-2 border-[2px] border-dashed border-[#c8c8c8] rounded-lg cursor-pointer hover:underline"
          onClick={() => navigate("/zones")}
        >
          All zones
        </p>
        <div
          className="flex flex-row items-center cursor-pointer hover:bg-gray-100 p-2 rounded-md group"
          onClick={!isLoading ? handleLogout : undefined}
        >
          {isLoading ? (
            <CircularProgress size={24} color="error" />
          ) : (
            <>
              <IconButton
                sx={{
                  color: "red",
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <LogoutIcon />
              </IconButton>
              <p className="font-redhat text-2xl font-semibold ml-2 group-hover:text-red-600">
                Log out
              </p>{" "}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
