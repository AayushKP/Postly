import { useState } from "react";
import useUserInfoStore from "../store/store";
import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiBook, FiLogOut, FiEdit } from "react-icons/fi";

export const Appbar = () => {
  const { userInfo, theme } = useUserInfoStore();
  const isLightMode = theme === "white";
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      useUserInfoStore.getState().clearUserInfo();
      navigate("/");
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <div
      className={`shadow-md z-50 ${
        isLightMode
          ? "bg-white"
          : "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
      }`}
    >
      <div className="flex justify-between items-center px-6 lg:px-32 py-4">
        <Link
          to={"/blogs"}
          className={`flex items-center font-bold text-4xl ${
            isLightMode
              ? "text-yellow-600 hover:text-yellow-500"
              : "text-blue-400 hover:text-blue-300"
          } transition-all`}
        >
          <div className="font-ysabeau">PostLy</div>
        </Link>

        <div className="flex items-center space-x-6">
          <Link
            to={`/publish`}
            className={`flex items-center ${
              isLightMode
                ? "text-black hover:text-gray-700"
                : "text-gray-100 hover:text-gray-300"
            } px-4 py-2 rounded-md font-medium text-lg transition-colors`}
          >
            <FiEdit className="mr-2 text-lg" />
            <span>Write</span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="focus:outline-none"
              aria-label="User menu"
            >
              <Avatar size="big" name={userInfo?.username || "Guest"} />
            </button>

            {isDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 ${
                  isLightMode ? "bg-white" : "bg-gray-800"
                } shadow-lg rounded-lg py-2 z-50 border ${
                  isLightMode ? "border-gray-200" : "border-gray-700"
                }`}
              >
                <Link
                  to="/profile"
                  className={`flex items-center px-4 py-2 text-sm ${
                    isLightMode
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-gray-200 hover:bg-gray-700"
                  } rounded-md transition-colors`}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FiUser className="mr-2 text-lg" />
                  Profile
                </Link>
                <Link
                  to="/library"
                  className={`flex items-center px-4 py-2 text-sm ${
                    isLightMode
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-gray-200 hover:bg-gray-700"
                  } rounded-md transition-colors`}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FiBook className="mr-2 text-lg" />
                  Library
                </Link>
                {userInfo?.username && (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm ${
                      isLightMode
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-gray-200 hover:bg-gray-700"
                    } rounded-md transition-colors`}
                  >
                    <FiLogOut className="mr-2 text-lg" />
                    Sign Out
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
