import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Avatar } from "../components/BlogCard";
import useUserInfoStore from "../store/store";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo, theme, toggleTheme } = useUserInfoStore();
  const isLightMode = theme === "white";

  const [user, setUser] = useState({
    bio: userInfo?.bio || "",
    email: userInfo?.username || "",
    password: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userInfo) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`${BACKEND_URL}/api/v1/user-info`, {
            headers: { authorization: token || "" },
          });
          const { name, bio, username, id } = response.data.user;
          setUserInfo({ id, name, bio, username, bookmarkedBlogs: [] });
          setUser({ bio: bio, email: username, password: "" });
        } catch (error) {
          console.error("Error fetching user info:", error);
          alert("Failed to load profile information.");
        }
      }
    };
    fetchUserInfo();
  }, [userInfo, setUserInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSave = async () => {
    const { bio, password } = user;
    const changes = {
      bio: bio !== userInfo?.bio ? bio : undefined,
      password: password ? password : undefined,
    };

    if (!changes.bio && !changes.password) {
      alert("Nothing changed.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${BACKEND_URL}/api/v1/user/update`, changes, {
        headers: { authorization: token || "" },
      });
      alert("Profile updated successfully!");
      //@ts-ignore
      setUserInfo({ ...userInfo, bio: bio });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isLightMode ? "bg-gray-100 text-gray-900" : "bg-gray-900 text-gray-100"
      }`}
    >
      <button
        onClick={() => navigate(-1)}
        className="absolute top-2 left-2 lg:top-6 lg:left-6 bg-yellow-600 text-xl text-white h-10 w-10 text-center rounded-full hover:bg-yellow-700"
      >
        ←
      </button>

      <div
        className={`shadow-lg rounded-xl w-11/12 lg:w-2/3 h-auto lg:h-[70vh] p-6 flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0 ${
          isLightMode ? "bg-white" : "bg-gray-800"
        }`}
      >
        <div className="w-full lg:w-1/3 flex items-center justify-center">
          <Avatar name={userInfo?.name || "User"} size="huge" />
        </div>

        <div className="w-full lg:w-2/3 p-6 space-y-6">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={userInfo?.name || ""}
                disabled
                className="w-full border rounded-lg px-3 py-2 bg-gray-200 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Bio</label>
              <input
                type="text"
                name="bio"
                value={user.bio}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  isLightMode
                    ? "focus:ring-blue-400"
                    : "focus:ring-blue-300 bg-gray-700 text-white"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                disabled
                className="w-full border rounded-lg px-3 py-2 bg-gray-200 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleInputChange}
                placeholder="Enter a new password"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  isLightMode
                    ? "focus:ring-blue-400"
                    : "focus:ring-blue-300 bg-gray-700 text-white"
                }`}
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
