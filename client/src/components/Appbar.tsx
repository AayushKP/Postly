import useUserInfoStore from "../store/store";
import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";

export const Appbar = () => {
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // Clear token and user info from storage
      localStorage.removeItem("token");
      useUserInfoStore.getState().clearUserInfo();

      // Redirect to signin page
      navigate("/signin");
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="border-b flex justify-between items-center px-10 py-2">
      <Link
        to={"/blogs"}
        className="flex flex-col justify-center items-center cursor-pointer font-bold"
      >
        <div className="flex gap-2 justify-center items-center">
          <div className="font-ysabeau text-4xl">PostLy</div>
          <div className="flex items-center">
            <img src="/postly.jpg" className="h-6 w-6" alt="PostLy Logo" />
          </div>
        </div>
      </Link>
      <div>
        <Link to={`/publish`}>
          <button
            type="button"
            className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
          >
            New
          </button>
        </Link>

        <Avatar size="big" name={userInfo?.username || "Guest"} />

        {/* Logout Button */}
        {userInfo?.username && (
          <button
            onClick={handleLogout}
            className="ml-4 text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};
