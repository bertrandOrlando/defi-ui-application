import { FaArrowLeft } from "react-icons/fa";
import usersData from "../data/users.json";
import rolesData from "../data/roles.json";
import { useNavigate } from "react-router-dom";

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

  return (
    <header
      className={`flex items-center justify-between p-4 w-full text-white ${className}`}
    >
      {/* Back Button */}
      <div className="flex flex-col text-sm">
        <button
          onClick={onBack}
          className="flex items-center overflow-hidden rounded-md bg-[#5a5a5a] hover:bg-[#4a4a4a] text-sm font-semibold"
        >
          <span className="p-2 bg-[#6b6b6b] bg-opacity-20 flex items-center justify-center">
            <FaArrowLeft size={16} />
          </span>
          <span className="px-3">Back</span>
        </button>
      </div>

      {/* Center*/}
      <div className="flex items-center space-x-2">
        <span className="text-lg font-semibold">5G Def-i</span>
      </div>

      {/* right side */}
      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-end text-sm">
          <span>{currentUser?.name || "User Name"}</span>
          <p className="text-sm">{currentRole?.roleName || "User Role"}</p>
        </div>
        {/* DUMMY ICON */}
        <img src="src\assets\user.png" className="h-10 w-10"></img>
      </div>
    </header>
  );
};

export default Header;
