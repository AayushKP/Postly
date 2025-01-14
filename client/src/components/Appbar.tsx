import { useState } from "react";
import useUserInfoStore from "../store/store";
import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiBook, FiLogOut, FiEdit } from "react-icons/fi"; // Changed icon from FiPlus to FiEdit

export const Appbar = () => {
  const { userInfo } = useUserInfoStore();
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
    <div className="bg-white shadow-md z-50">
      <div className="flex justify-between items-center px-6 lg:px-32 py-4">
        <Link
          to={"/blogs"}
          className="flex items-center font-bold text-4xl text-yellow-600 hover:text-yellow-500 transition-all"
        >
          <div className="font-ysabeau">PostLy</div>
        </Link>

        <div className="flex items-center space-x-6">
          <Link
            to={`/publish`}
            className="flex items-center text-black px-4 py-2 rounded-md font-medium text-lg"
          >
            <FiEdit className="mr-2 text-lg" />
            <span>Write</span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="focus:outline-none"
            >
              <Avatar size="big" name={userInfo?.username || "Guest"} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50 border border-gray-200">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FiUser className="mr-2 text-lg" />
                  Profile
                </Link>
                <Link
                  to="/library"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
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
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
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
