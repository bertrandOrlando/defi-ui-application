import { FaArrowLeft } from "react-icons/fa";
import usersData from "../data/users.json";
import rolesData from "../data/roles.json";
import { useNavigate } from "react-router-dom";
import UserIcon from "/user.png";
import { Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";

/* TODO :
 * - Harus Handle User Profile
 * - Handle Authentication User
 */

const Header = ({ className }: { className?: string }) => {
  const currentUser = usersData.users.find((user) => user.userId === "001");
  const currentRole = rolesData.roles.find(
    (role) => role.roleId === currentUser?.roleId
  );

  const navigate = useNavigate();

  const onBack = () => {
    navigate(-1);
  };

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const closeMenuHandler = () => {};

  const logoutHandler = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <header
      className={`flex items-center justify-between p-4 w-full text-white ${className}`}
    >
      {/* Back Button */}
      <div className="flex flex-col text-sm">
        <button
          onClick={onBack}
          className="flex items-center overflow-hidden rounded-md bg-[#5a5a5a] hover:bg-[#4a4a4a] text-sm font-semibold cursor-pointer"
        >
          <span className="p-2 bg-[#6b6b6b] bg-opacity-20 flex items-center justify-center">
            <FaArrowLeft size={16} />
          </span>
          <span className="px-3">Back</span>
        </button>
      </div>

      {/* Center*/}
      <div className="flex items-center space-x-2">
        <img
          src="/logo-transparent.png"
          alt="hero logo"
          width={75}
          height={75}
        />
        <span className="text-xl">
          <span className="font-semibold">5G</span> Def-i
        </span>
      </div>

      {/* right side */}
      <button
        className="flex items-center space-x-4 cursor-pointer"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <div className="flex flex-col items-end text-sm">
          <span>{currentUser?.name || "User Name"}</span>
          <p className="text-sm">{currentRole?.roleName || "User Role"}</p>
        </div>
        {/* DUMMY ICON */}
        <img src={UserIcon} className="h-10 w-10"></img>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={isMenuOpen}
          onClose={closeMenuHandler}
          PaperProps={{
            sx: {
              backgroundColor: "#343536",
              "& .MuiList-root": {
                paddingTop: 0,
                paddingBottom: 0,
              },
            },
          }}
        >
          <MenuItem
            onClick={logoutHandler}
            sx={{
              color: "white",
              transition: "background-color 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#4a4b4c",
              },
            }}
          >
            <Typography sx={{ textAlign: "center" }}>Logout</Typography>
          </MenuItem>
        </Menu>
      </button>
    </header>
  );
};

export default Header;
