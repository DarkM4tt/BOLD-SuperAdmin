import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const Header = () => {
  return (
    <div className="flex-1 flex flex-row justify-between items-center shadow-md px-8 py-2 bg-white">
      <p className="font-redhat text-2xl font-semibold">Owner Access</p>
      <div className="flex flex-row gap-10 items-center">
        <p
          className="font-redhat text-2xl font-semibold px-4 py-2 border-[2px] border-dashed border-[#c8c8c8] rounded-lg cursor-pointer hover:underline"
          // onClick={() => setActiveComponent("Zones")}
        >
          All zones
        </p>
        <div
          className="flex flex-row items-center cursor-pointer hover:bg-gray-100 p-2 rounded-md group"
          // onClick={handleLogout}
        >
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
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
