import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import superadminlogo from "../assets/boldLogo.png";

const menuItems = [
  { name: "Dashboard", path: "/" },
  {
    name: "Services",
    path: "/services",
    subMenu: [
      { name: "Overview", path: "/services/overview" },
      { name: "Jumpstart", path: "/services/jumpstart" },
      { name: "Packages", path: "/services/packages" },
      { name: "BOLD Miles", path: "/services/bold-miles" },
    ],
  },
  { name: "Partners", path: "/partners" },
  { name: "Coupons", path: "/coupons" },
  { name: "Location", path: "/location" },
  { name: "Zones", path: "/zones" },
];

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    menuItems.forEach((item) => {
      if (
        item.subMenu &&
        item.subMenu.some((sub) => sub.path === location.pathname)
      ) {
        setOpenMenu(item.name);
      }
    });
  }, [location.pathname]);

  const handleMenuClick = (item) => {
    if (item.subMenu) {
      if (openMenu === item.name) {
        setOpenMenu(null);
      } else {
        setOpenMenu(item.name);
        navigate(item.subMenu[0].path);
      }
    } else {
      setOpenMenu(null);
      navigate(item.path);
    }
  };

  return (
    <div className="bg-[#1C1B1B] text-white h-screen w-1/6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <img src={superadminlogo} alt="logo" className="w-[33%]" />
        <p className="font-sans font-semibold text-sm">Super Admin Controls</p>
      </div>

      <ul className="mt-12">
        {menuItems.map((item) => {
          const isActive = (() => {
            if (item.name === "Dashboard") {
              const otherItems = menuItems.filter(
                (i) => i.name !== "Dashboard"
              );
              const isInOtherPath = otherItems.some((other) => {
                return (
                  location.pathname === other.path ||
                  location.pathname.startsWith(other.path + "/") ||
                  (other.subMenu &&
                    other.subMenu.some((sub) =>
                      location.pathname.startsWith(sub.path)
                    ))
                );
              });
              return location.pathname === "/" || !isInOtherPath;
            }

            return (
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/") ||
              (item.subMenu &&
                item.subMenu.some((sub) =>
                  location.pathname.startsWith(sub.path)
                ))
            );
          })();

          return (
            <li key={item.name} className="mb-2">
              <div
                onClick={() => handleMenuClick(item)}
                className={`flex flex-col px-3 py-3 cursor-pointer transition-all rounded-md font-redHat font-normal
    ${isActive ? "font-semibold text-white" : "text-textGray hover:text-white"}
  `}
              >
                <div className="flex items-center justify-between text-xl">
                  <span>{item.name}</span>
                  {item.subMenu && (
                    <span>
                      {openMenu === item.name ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </span>
                  )}
                </div>
                {isActive && !item.subMenu && (
                  <div className="w-6 h-[3px] bg-boldCyan mt-1 rounded-sm"></div>
                )}
              </div>
              {item.subMenu && openMenu === item.name && (
                <ul className="ml-4 border-l-[3px] border-gray-600 pl-3 mt-1">
                  {item.subMenu.map((sub) => (
                    <NavLink
                      key={sub.name}
                      to={sub.path}
                      className={({ isActive }) =>
                        `block py-2 px-3 transition-all rounded-md relative font-redhat font-normal text-base ${
                          isActive
                            ? "text-white font-semibold bg-[rgba(24,196,184,0.2)]"
                            : "text-textGray hover:text-white"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <div className="flex items-center">
                          {isActive && (
                            <div className="absolute left-[-15px] w-[3px] h-full bg-[#18C4B8] rounded-md"></div>
                          )}
                          {sub.name}
                        </div>
                      )}
                    </NavLink>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
